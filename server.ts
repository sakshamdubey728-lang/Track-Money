import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini API client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== "MY_GEMINI_API_KEY") {
      aiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
  }
  return aiClient;
}

// 1. AI Savings Coach API endpoint
app.post("/api/ai-coach", async (req: Request, res: Response) => {
  try {
    const data = req.body;
    
    // Extract overview details for context
    const code = data.currency || "USD";
    const symbol = data.currencySymbol || "$";
    const budget = data.monthlyBudget || 0;
    const expenses = data.expenses || [];
    const incomes = data.incomes || [];
    const recurring = data.recurringPayments || [];
    const goals = data.savingsGoals || [];
    const isPremium = data.isPremium || false;
    const avatarLevel = data.avatarLevel || 1;

    // Build statistics to supply to the coach
    const totalExpenses = expenses.reduce((sum: number, e: any) => sum + Number(e.amount), 0);
    const totalIncome = incomes.reduce((sum: number, i: any) => sum + Number(i.amount), 0);
    const netCashflow = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;
    
    // Group expenses by category
    const categoryTotals: Record<string, number> = {};
    expenses.forEach((e: any) => {
      categoryTotals[e.category] = (categoryTotals[e.category] || 0) + Number(e.amount);
    });

    const categorySummaryString = Object.entries(categoryTotals)
      .map(([cat, total]) => `- ${cat}: ${symbol}${total.toFixed(2)}`)
      .join("\n");

    const recurringSummaryString = recurring
      .map((r: any) => `- ${r.name} (${r.category}): ${symbol}${r.cost}/month (Due day ${r.dueDate})`)
      .join("\n");

    const goalsSummaryString = goals
      .map((g: any) => `- ${g.name}: Target ${symbol}${g.targetAmount}, Saved: ${symbol}${g.currentAmount} (Date: ${g.targetDate}, Monthly Contrib: ${symbol}${g.monthlyContribution})`)
      .join("\n");

    // Construct prompting instruction
    const systemPrompt = `You are "Track Money Savings Coach", a smart, savvy, and encouraging personal finance optimizer specialized in college students and young professionals (aged 18-35).
Your tone is friendly, smart, highly analytical yet practical and actionable, using occasional young professional metaphors (like coffee, streaming services, streaks, avatar items). Avoid dry financial jargon; give direct, clear numbers and bold, scannable steps.

Help the user improve their savings rate, stay under their budget limits, spot subscription leakage, and achieve their goals.`;

    const userPrompt = `Here is my current financial status (Currency: ${code}, Symbol: ${symbol}):
- Overall Monthly Budget: ${symbol}${budget}
- Total Income: ${symbol}${totalIncome.toFixed(2)}
- Total ExpensesLogged: ${symbol}${totalExpenses.toFixed(2)}
- Current Cashflow: ${symbol}${netCashflow.toFixed(2)}
- Current Savings Rate: ${savingsRate.toFixed(1)}%
- Avatar progression level: Level ${avatarLevel}
- Account Tier: ${isPremium ? "Premium ($4.99/mo)" : "Free Tier"}

Category-wise Spending:
${categorySummaryString || "No expenses logged yet."}

Active Subscriptions / Fixed Expenses:
${recurringSummaryString || "No recurring payments tracked yet."}

My Savings Goals:
${goalsSummaryString || "No savings goals created yet."}

${
  isPremium
    ? "As a PREMIUM user, provide a comprehensive deep-dive report that includes an advanced budget optimization strategy, a detailed subscription audit, an action plan for their specific goals, and an estimate of money they could save over the next 12 months with a clear timeline."
    : "As a FREE tier user, provide 3 to 4 direct, highly-actionable, and crisp recommendations for budgeting, cutting spending, and goals."
}

Please return the advice in Markdown. Do not repeat my statistics back in list format verbatim, instead make calculations, spot anomalies, and write direct recommendations in conversational bullet points. Avoid mentioning internal prompt mechanics or secret codes. Start with a motivational hook based on their current Level ${avatarLevel} status!`;

    const client = getGeminiClient();
    
    if (client) {
      try {
        // Call Gemini API on server side
        const response = await client.models.generateContent({
          model: "gemini-3.5-flash",
          contents: userPrompt,
          config: {
            systemInstruction: systemPrompt,
            temperature: 0.7,
          },
        });

        const responseText = response.text || "No insights generated.";
        res.json({ success: true, insights: responseText, source: "gemini" });
      } catch (apiError: any) {
        console.warn("Gemini API call failed, falling back to local finance coach:", apiError);
        
        const fallbackInsights = generateLocalInsights(
          symbol,
          budget,
          totalExpenses,
          totalIncome,
          netCashflow,
          savingsRate,
          categoryTotals,
          recurring,
          goals,
          isPremium,
          avatarLevel
        );

        // Prepend a polite notice about high demand being handled via offline optimizer
        const premiumNotice = isPremium 
          ? `\n\n*(Track Money Premium offline engine active due to high server load)*`
          : `\n\n*(Offline engine active due to high server load)*`;

        res.json({ 
          success: true, 
          insights: `⚠️ **Savings Coach Alert:** The live AI model is experiencing extremely high demand right now. I've initiated our local rule-based expert systems to analyze your dashboard immediately:\n\n` + fallbackInsights + premiumNotice, 
          source: "local-fallback" 
        });
      }
    } else {
      // Return beautiful, fallback local recommendation if GEMINI_API_KEY is not set or not updated yet
      const fallbackInsights = generateLocalInsights(
        symbol,
        budget,
        totalExpenses,
        totalIncome,
        netCashflow,
        savingsRate,
        categoryTotals,
        recurring,
        goals,
        isPremium,
        avatarLevel
      );
      res.json({ success: true, insights: fallbackInsights, source: "local" });
    }
  } catch (error: any) {
    console.error("Error in AI Coach endpoints: ", error);
    res.status(500).json({ success: false, error: error.message || "Failed to make call to Gemini." });
  }
});

// Fallback logic for local automated finance recommendations
function generateLocalInsights(
  symbol: string,
  budget: number,
  totalExpenses: number,
  totalIncome: number,
  netCashflow: number,
  savingsRate: number,
  categoryTotals: Record<string, number>,
  recurring: any[],
  goals: any[],
  isPremium: boolean,
  avatarLevel: number
): string {
  let text = `🚀 **Level ${avatarLevel} Track Money Academy Spark!** Let's supercharge your savings today. (Running Local Savings Coach Engine)\n\n`;

  if (totalExpenses === 0) {
    return text + `### 🌟 Welcome to your Track Money Coach Workspace!
It looks like you haven't logged any expenses yet this month. 
**Your First Move:** 
1. Log your daily coffee, boba, or meal in the log form.
2. Add your income sources to calculate your precise cashflow.
3. Once logged, I will perform a category-spent analysis!`;
  }

  // 1. Check budget overspending
  if (totalExpenses > budget && budget > 0) {
    const overflow = totalExpenses - budget;
    text += `⚠️ **High Alert:** You have overspent your monthly budget limit of **${symbol}${budget}** by **${symbol}${overflow.toFixed(2)}**. Let's scale back on non-essentials immediately to protect your avatar item upgrades!\n\n`;
  } else if (totalExpenses > budget * 0.8 && budget > 0) {
    const remains = budget - totalExpenses;
    text += `🔔 **Budget Alert:** You've used **${((totalExpenses / budget) * 100).toFixed(0)}%** of your monthly limit. Only **${symbol}${remains.toFixed(2)}** is left before you trigger budget overspending penalties!\n\n`;
  } else {
    text += `✅ **Healthy Pace:** Clean budget pacing! You have used **${budget ? ((totalExpenses / budget) * 100).toFixed(0) : 0}%** of your target limit. Play it safe to maintain your check-in savings streak!\n\n`;
  }

  // 2. Specific category analysis
  text += `### 📊 Custom Spend Analysis\n`;
  const entries = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
  if (entries.length > 0) {
    const [topCat, topVal] = entries[0];
    const percentage = totalExpenses > 0 ? (topVal / totalExpenses) * 100 : 0;
    text += `* **Top Expense Sink:** **${topCat}** represents your biggest spending sector, eating up **${symbol}${topVal.toFixed(2)}** or **${percentage.toFixed(0)}%** of total logs. If you trim just 10% here, you would save **${symbol}${(topVal * 0.1).toFixed(2)}** this month!\n`;
  }

  // Rent / Dining out ratio
  if (categoryTotals["Food"] && categoryTotals["Food"] > totalIncome * 0.25 && totalIncome > 0) {
    text += `* 🍔 **Foodie Warning:** Food delivery and dining out are swallowing over **25%** of your total monthly income. Preparing simple meals at home twice a week can recover valuable cash flow!\n`;
  }
  if (categoryTotals["Shopping"] && categoryTotals["Shopping"] > 100) {
    text += `* 🛍️ **Impusle Purchases Check:** Shopping stands at **${symbol}${categoryTotals["Shopping"].toFixed(2)}**. Double-check if these were essential items or spontaneous treats. Delay purchases by 48 hours next time to build healthy resistance!\n`;
  }

  // 3. Subscriptions / fixed audit
  if (recurring.length > 0) {
    const totalRecur = recurring.reduce((sum, r) => sum + r.cost, 0);
    text += `\n### 🔌 Subscription Leak Monitor\n`;
    text += `* You have **${recurring.length}** tracked subscription(s) costing a total of **${symbol}${totalRecur.toFixed(2)}/month**.\n`;
    if (recurring.length > 3) {
      text += `* ⚠️ **Subscription Overload:** Managing ${recurring.length} active recurring items increases the risk of "invisible expenditures". Inspect if you really used all of them in the last two weeks.\n`;
    }
    const upcoming = recurring.filter(r => !r.isPaidThisMonth);
    if (upcoming.length > 0) {
      text += `* **Next Payment Due:** ${upcoming[0].name} has an active payment due on day **${upcoming[0].dueDate}** of the month.\n`;
    }
  }

  // 4. Goal contribution recommendation
  if (goals.length > 0) {
    text += `\n### 🏁 Goal-Getter Blueprint\n`;
    goals.forEach((g: any) => {
      const progressPercent = g.targetAmount > 0 ? (g.currentAmount / g.targetAmount) * 100 : 0;
      if (progressPercent >= 100) {
        text += `* 🎉 **Goal Completed:** You successfully saved enough for **${g.name}**! Treat yourself to a Level-Up upgrade in your customization drawer.\n`;
      } else {
        const remaining = g.targetAmount - g.currentAmount;
        const monthsNeeded = g.monthlyContribution > 0 ? remaining / g.monthlyContribution : Infinity;
        text += `* **${g.name} (${progressPercent.toFixed(0)}% saved):** Needs **${symbol}${remaining.toFixed(2)}** to complete. At your rate of ${symbol}${g.monthlyContribution}/month, you will reach this in **${isFinite(monthsNeeded) ? monthsNeeded.toFixed(1) : "N/A"} months**.\n`;
      }
    });
  } else {
    text += `\n* 💡 **Pro Savings Tip:** Add your first savings goal (e.g. "Laptop Fund" or "Summer Getaway") to unlock automated target completion calculations and trigger custom progress coins in your Savings Jar!\n`;
  }

  // Premium tier content
  if (isPremium) {
    text += `\n### ⭐ Premium Wealth-Builder Bonus\n`;
    text += `* **12-Month Projections:** Based on your current net cashflow of **${symbol}${netCashflow.toFixed(2)}**, your projected savings over the next 12 months is **${symbol}${(netCashflow * 12).toFixed(2)}**!\n`;
    text += `* **Custom Action Item:** Automate a **${symbol}${(totalIncome * 0.1).toFixed(0)}** direct savings transfer to your savings goals on the day your income hits to bypass manual impulse triggers completely.\n`;
    text += `* **Priority VIP Tip:** Level 5+ outfit slots have customized visual badges to share on social channels. Maintain your logged check-in streak to earn those XP multipliers!`;
  } else {
    text += `\n*💡 Upgrade to **Track Money Premium** to unlock advanced AI forecasting, unlimited monthly financial projections, and premium legend outfit slots!*`;
  }

  return text;
}

// 2. Setup Vite Server
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express server listening on http://localhost:${PORT}`);
  });
}

startServer();
