import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User, signOut } from "firebase/auth";
import firebaseConfig from "../../firebase-applet-config.json";

// Initialize Firebase App if not already done
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();
provider.addScope("https://www.googleapis.com/auth/spreadsheets");
provider.addScope("https://www.googleapis.com/auth/drive.file");

let isSigningIn = false;
let cachedAccessToken: string | null = null;

// Initialize Auth listener
export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        // User is logged in but token might not be cached yet (e.g. on hard reload).
        // Since we cannot retrieve Google OAuth scopes without a fresh sign-in popup (with Firebase Client SDK),
        // we'll require a quick login interaction.
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

// googleSignIn action
export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential?.accessToken;
    if (!token) {
      throw new Error("Failed to retrieve Google Sheets access token from login.");
    }
    cachedAccessToken = token;
    return { user: result.user, accessToken: token };
  } catch (error) {
    console.error("Sign in error:", error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

// Get the current token
export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

// logout action
export const logoutUser = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};

export interface SheetRow {
  date: string;
  notes: string;
  category: string;
  amount: number;
  currency: string;
}

// Create Spreadsheet & Write Monthly Data
export const exportToGoogleSheetsInstance = async (
  token: string,
  title: string,
  expenses: SheetRow[],
  currencySymbol: string,
  totalAmount: number
): Promise<{ spreadsheetId: string; spreadsheetUrl: string }> => {
  // 1. Create a brand new spreadsheet
  const createResponse = await fetch("https://sheets.googleapis.com/v4/spreadsheets", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      properties: {
        title: title,
      },
    }),
  });

  if (!createResponse.ok) {
    const errorData = await createResponse.json();
    throw new Error(errorData?.error?.message || "Failed to create Google Sheet template.");
  }

  const spreadsheet = await createResponse.json();
  const spreadsheetId = spreadsheet.spreadsheetId;
  const spreadsheetUrl = spreadsheet.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

  // 2. Prepare grid data layout
  // Column Headers, followed by the expense rows, followed by spacing, followed by Summary
  const values: any[][] = [
    ["Spendo Monthly Expense Export Report"],
    [`Report Title: ${title}`],
    [`Export Date: ${new Date().toLocaleDateString()}`],
    [], // Blank spacing
    ["Date", "Notes / Description", "Category", "Amount", "Currency"], // Headers
  ];

  // Insert items
  expenses.forEach((e) => {
    values.push([e.date, e.notes || "N/A", e.category, e.amount, e.currency]);
  });

  // Totals calculations
  values.push([]);
  values.push(["Total Expenditure Consolidated:", "", "", totalAmount, currencySymbol]);
  values.push([]);
  values.push(["", "Category Summary Statistics", "", "Total Spent", "Currency"]);

  // Group by category summary
  const summary: Record<string, number> = {};
  expenses.forEach((e) => {
    summary[e.category] = (summary[e.category] || 0) + e.amount;
  });

  Object.entries(summary).forEach(([cat, amt]) => {
    values.push(["", cat, "", amt, currencySymbol]);
  });

  // Write values to A1
  const updateUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/A1:E${values.length + 5}?valueInputOption=USER_ENTERED`;
  const updateResponse = await fetch(updateUrl, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      range: `A1:E${values.length + 5}`,
      majorDimension: "ROWS",
      values: values,
    }),
  });

  if (!updateResponse.ok) {
    const errorData = await updateResponse.json();
    throw new Error(errorData?.error?.message || "Failed to populate rows on Google Sheet.");
  }

  // 3. Format the sheet beautifully via batchUpdate (e.g. bold header, color backgrounds, borders)
  try {
    const batchUpdateUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`;
    await fetch(batchUpdateUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        requests: [
          // Formatting sheet row sizes, colors for high design compliance
          {
            repeatCell: {
              range: {
                startRowIndex: 0,
                endRowIndex: 1,
                startColumnIndex: 0,
                endColumnIndex: 5,
              },
              cell: {
                userEnteredFormat: {
                  backgroundColor: { red: 0.02, green: 0.47, blue: 0.34 }, // Emerald green brand color
                  textFormat: {
                    foregroundColor: { red: 1.0, green: 1.0, blue: 1.0 },
                    fontSize: 14,
                    bold: true,
                  },
                },
              },
              fields: "userEnteredFormat(backgroundColor,textFormat)",
            },
          },
          {
            repeatCell: {
              range: {
                startRowIndex: 4,
                endRowIndex: 5,
                startColumnIndex: 0,
                endColumnIndex: 5,
              },
              cell: {
                userEnteredFormat: {
                  backgroundColor: { red: 0.94, green: 0.96, blue: 0.98 }, // Soft grey header
                  textFormat: {
                    foregroundColor: { red: 0.1, green: 0.15, blue: 0.25 },
                    bold: true,
                  },
                },
              },
              fields: "userEnteredFormat(backgroundColor,textFormat)",
            },
          },
        ],
      }),
    });
  } catch (formatErr) {
    console.warn("Formatting stylesheet failed, proceeding with generic version:", formatErr);
  }

  return { spreadsheetId, spreadsheetUrl };
};
