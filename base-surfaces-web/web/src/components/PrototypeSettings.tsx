import { useState, useEffect, useRef, useCallback } from 'react';
import { Drawer, SelectInput, SelectInputOptionContent, SegmentedControl, Field, Input, ListItem, Button, useSnackbar } from '@transferwise/components';
import { Slider } from '@transferwise/icons';

const PROMPT_NEW_FLOW = `You are building a new interactive flow for a Wise app prototype. This prototype is a high-fidelity React + TypeScript + Vite project that replicates the Wise app's top-level surfaces (Home, Cards, Transactions, Payments, Recipients, Team, Insights, Account, CurrentAccount, CurrencyPage). Your job is to build a new multi-step flow that launches from an existing entry point in this prototype.

Before writing any code, ask the user the following questions **one at a time**, waiting for each answer:

---

### Step 1: Account type
Which account type should this flow be built for?
- **Consumer/Personal** — the default personal account (nav: Home, Cards, Transactions, Payments with Bill splits/Payment requests, Recipients, Insights)
- **Business** — the business account (nav: Home, Cards, Transactions, Payments with Bills/Batch/Invoices/Payment links/Quick Pay, Team, Recipients, Insights)
- **Both** — the flow exists on both account types (may have minor differences between them)

### Step 2: Entry point
Where in the prototype does this flow start? Ask the user to name:
- The **page** (e.g. Home, Payments, Account/Profile, Cards, CurrentAccount, CurrencyPage)
- The **specific element** that triggers the flow (e.g. "Send" action button, "Payment methods" menu item, "Order a new card" list item, "Add a currency" button)

If the user is unsure, list the available entry points on the relevant page so they can pick one. The main action buttons are:
- **Home page (personal)**: Send, Add money, Request, Convert (top action row); plus account cards, Send Again contacts
- **Home page (business)**: Send, Add money, Get paid (dropdown: Share payment link, Create invoice, Request a payment, Split a bill, Pay invoice), Convert (top action row)
- **Account/Profile page**: Security and privacy, Notifications, Integrations and tools, Payment methods, Limits, Language and appearance, Personal details (personal) / Business details (business), Team members (business), Referrals, Close account
- **Cards page**: Order a new card, Travel hub, individual card items
- **Payments page**: Scheduled transfers, Direct Debits, Recurring card payments, Payment requests/Bills, Bill splits/Batch, Invoices, Payment links, Quick Pay, Wisetag, Auto Conversions, Ecommerce
- **CurrentAccount page**: individual currency items, Add a currency, Edit current account
- **CurrencyPage**: Statements and reports, Direct Debits, Get proof, Remove currency, Auto conversions, Set up connection (business)

### Step 3: Design references
Ask the user to provide as many of the following as they can — each one significantly improves the output quality:
- **Figma URL** — a link to the Figma design for this flow (e.g. \`figma.com/design/...\`). If provided, use the Figma MCP tool (\`get_design_context\`) to extract the design, code hints, component mappings, and screenshots.
- **Screenshots** — photos or screenshots of the flow from the live Wise app or another reference. These help match layout, spacing, and visual details.
- **Source code** — if they have access to the production source code for this flow, they can paste relevant components or point to files. This helps match exact data structures and API patterns.
- **Written spec** — a description of what each step in the flow does, what inputs are collected, what happens on submit, error states, etc.

Tell the user: "The more reference material you provide, the more accurate the result. Figma designs are especially useful — I can read them directly via the Figma MCP connection."

### Step 4: Flow details
Based on what the user has described, confirm your understanding by listing:
- The entry point and how it's triggered
- Each screen/step in the flow (e.g. "Step 1: Select recipient → Step 2: Enter amount → Step 3: Review → Step 4: Confirmation")
- What data is collected at each step
- Any loading, error, or empty states
- How the user exits/completes the flow (success screen, back to previous page, etc.)

Ask the user to confirm or adjust before building.

---

## Implementation rules

Once confirmed, follow these rules strictly:

### Architecture
- **No router.** Navigation is state-driven. The app uses \`activeNavItem\` (English string like \`'Home'\`, \`'Cards'\`) for top-level pages and a \`subPage\` union type for drill-down views. Your flow should add new entries to the \`SubPage\` type or use a local state machine within a page component.
- **Flow as a component.** Create the flow as a single component (e.g. \`src/flows/SendFlow.tsx\` or \`src/pages/SendFlow.tsx\`) that manages its own step state internally. The parent page passes an \`onClose\` or \`onBack\` callback.
- **Entry point wiring.** Wire the entry point button/item to open your flow via state in the parent page. Don't modify the existing page structure beyond adding the trigger.

### Component usage
- **Always use \`@transferwise/components\`** — Button, IconButton, ListItem, Field, Input, SelectInput, SegmentedControl, SearchInput, Badge, Drawer, Modal, Snackbar, etc. Never build custom equivalents.
- **Always use \`@transferwise/icons\`** — for any iconography. Browse the available icons in the package.
- **Use DS typography classes** — \`np-text-display-title\`, \`np-text-title-section\`, \`np-text-title-body\`, \`np-text-title-group\`, \`np-text-body-default\`, \`np-text-body-small\`, etc. Never hardcode font sizes.
- **Use DS colour tokens** — \`var(--color-content-primary)\`, \`var(--color-content-secondary)\`, \`var(--color-background-neutral)\`, \`var(--color-border-neutral)\`, \`var(--color-sentiment-positive)\`, \`var(--color-sentiment-negative)\`, etc. Never hardcode hex colours except for brand-specific ones documented in the currency data.
- **Use the local Flag component** (\`src/components/Flag.tsx\`) for currency flags, not \`@wise/art\`. Flags are self-hosted in \`public/flags/\`.
- **Use the local Illustration component** (\`src/components/Illustration.tsx\`) for promo illustrations, not \`@wise/art\`.

### Translations
- All user-facing text must go through the \`t()\` function from \`useLanguage()\`.
- Add new keys to both \`src/translations/en.ts\` and \`src/translations/es.ts\`.
- Key naming: use the pattern \`flow.<flowName>.<element>\` (e.g. \`flow.send.recipientTitle\`, \`flow.send.amountLabel\`).
- Do NOT translate: names, currency codes, amounts, brand terms.

### Styling
- Add styles to \`src/styles.css\` using BEM-like class naming: \`.<flow-name>__<element>\` (e.g. \`.send-flow__header\`, \`.send-flow__step\`).
- Follow the existing responsive patterns: XL (>=1160px), LG (840-1159px), MD (600-839px), SM (<600px).
- Use \`section-card\` class for card-like containers where appropriate.
- Use existing spacing patterns from the prototype (padding/margin multiples of 4px or 8px).

### Data
- If the flow needs data (recipients, currencies, etc.), import from existing data files (\`src/data/currencies.ts\`, \`src/data/transactions.tsx\`, etc.) where possible.
- If new data is needed, create a new file in \`src/data/\` following the existing patterns.
- Use the \`usePrototypeNames()\` context for the current user's name.
- Use \`AccountType\` from \`src/App.tsx\` to handle consumer vs business differences.

### Quality
- Run \`npx tsc --noEmit\` to verify no type errors.
- Test the flow in both light and dark themes.
- Test at desktop, tablet, and mobile breakpoints.
- Ensure the back button in the TopBar correctly returns to the previous view.`;

const PROMPT_SWITCH_ACCOUNT = `Switch the prototype to start from the Business account instead of Consumer/Personal.

There are two places to update:

1. **src/App.tsx** — find the accountType state initialisation:
   \`const [accountType, setAccountType] = useState<AccountType>('personal');\`
   Change \`'personal'\` to \`'business'\`.

   In the component-library variant, the state is instead:
   \`const [isBusiness, setIsBusiness] = useState(false);\`
   Change \`false\` to \`true\`.

2. **src/components/PrototypeSettings.tsx** — find the segmented control state:
   \`const [accountType, setAccountType] = useState('consumer');\`
   Change \`'consumer'\` to \`'business'\`.

Do not change any other behaviour, navigation items, theme, or component logic. Only change the default initial values so the prototype loads in business mode.`;

const PROMPT_NEW_ACCOUNT = `Add a new account card to the prototype with its own currencies, subpages, and data.

Before making any changes, ask the user the following questions:

1. **Which account type?** — Should this new account be added to the Consumer/Personal side or the Business side? This matters because:
   - **Personal** has a single "Current account" card on the Home page with currencies (GBP, EUR, USD, CAD) and personal transactions. The navigation has personal-specific items (Bill splits, Payment requests).
   - **Business** already has a "Current account" card plus a "Taxes" card. The navigation has business-specific items (Bills, Batch, Invoices, Payment links, Quick Pay, Team). Business also has team members and team cards.

2. **What should the account be called?** — e.g. "Savings", "Travel", "Marketing", "Taxes" (if personal), "Operations", etc. This name appears on the card title and in the CurrentAccount page header.

3. **Which icon and colour?** — The account card header uses an avatar with a background colour and icon. Ask the user to pick:
   - **Colour** (one of the brand colours): Navy \`#37517e\`, Green \`#9FE870\`, Dark Green \`#163300\`, Yellow \`#FFEB69\`, Orange \`#FF7E42\`, Purple \`#BFA8FF\`, Aqua \`#92EFDB\`, Pink \`#FF89A9\`
   - **Icon** — pick from \`@transferwise/icons\` (e.g. Money, Briefcase, Globe, Rewards, Heart, Shield, etc.)

4. **Which currencies?** — Which currency balances should the new account have? e.g. GBP only, or GBP + EUR + USD, etc. Ask for starting balances for each.

5. **Should it have transactions?** — Ask whether the user wants:
   - Pre-populated sample transactions (like the existing accounts have), or
   - An empty account with no transaction history

6. **Should it have cards (payment cards) connected?** — Ask whether to:
   - Add new card(s) linked to this account (physical, digital, or both)
   - Leave it with no cards
   If yes, the cards need to appear in the Cards page and in the account's sidebar/options. The user needs to go to Figma and export the card tapestry images and the card medium icon for the new card variant. The tapestry assets are found here: https://www.figma.com/design/8RGFGBqhGilp95HIKw5PJa?node-id=75-3016 and the card medium icons here: https://www.figma.com/design/8RGFGBqhGilp95HIKw5PJa?node-id=75-3109. Export the relevant assets and place them in \`src/assets/\`.

7. **Should a team member be connected?** (Business only) — If adding to the business account, ask whether an existing team member (Connor Berry or Jamie Reynolds) or a new team member should be associated with this account group.

---

Once the user has answered, here is how to implement the new account:

### Data layer

1. **Create a new currency data file** — e.g. \`src/data/<name>-currencies.ts\`
   - Export an array of \`CurrencyData\` objects (same type as \`src/data/currencies.ts\`)
   - Export a total balance computed with \`.reduce()\`

2. **Create a new transactions data file** (if the user wants transactions) — e.g. \`src/data/<name>-transactions.tsx\`
   - Export an array of \`Transaction\` objects (same type as \`src/data/transactions.tsx\`)
   - Include icons from \`@transferwise/icons\` (Send, Receive, Convert, Plus) or imgSrc URLs for merchant logos
   - Each transaction needs: name, subtitle, amount (string), isPositive, icon or imgSrc, date, currency

### Home page (\`src/pages/Home.tsx\`)

3. **Add the new account card** to the Carousel in the Home page:
   - Import the new currency data and total balance
   - Add a new \`<MultiCurrencyAccountCard>\` inside the \`<Carousel>\` (before the \`<EmptyAccountCard />\`)
   - Set the card's props: title, totalAmount, currencyCount, balances, hasCards, cardCount
   - If it should look like the Taxes card (dark background, light text), set \`cardInfoLight\` and use custom \`cardTopImage\`/\`cardBottomImage\` pointing to the exported Figma tapestry assets
   - If it's a standard card, set \`businessCardStyle={false}\`
   - Wire up \`onNavigateAccount\` and \`onNavigateCurrency\` callbacks

4. **Update the total balance calculation** — The \`totalBalance\` variable on the Home page sums up all account balances. Add the new account's total to this sum so TotalBalanceHeader displays the correct overall balance.

### Account subpage (\`src/pages/CurrentAccount.tsx\`)

5. **Add a new jar/account variant** — The CurrentAccount component already handles \`jar?: 'taxes'\`. Extend this:
   - Add the new account name as a jar option in the \`Props\` type
   - Import the new currency and transaction data
   - Add conditions so when \`jar\` matches the new account, it uses the correct currencies, transactions, and total balance
   - Set the correct header label, icon, and colour in \`AccountPageHeader\`

### Navigation (\`src/App.tsx\`)

6. **Add SubPage routing** — The \`SubPage\` type union needs a new variant for the new account (like \`{ type: 'taxes-account' }\`). Add:
   - A new SubPage type entry
   - Navigation callbacks (\`onNavigate<Name>Account\`, \`onNavigate<Name>Currency\`) passed to the Home page
   - Breadcrumb handling so the user can navigate back from the new account's subpages

### Insights page (\`src/pages/Insights.tsx\`)

7. **Update balance calculations** — The Insights page computes:
   - \`totalBalance\`: must include the new account's currencies
   - \`cashBalance\`: must include the new account's balances
   - \`spentThisMonth\`: must include debits from the new account's transactions
   - \`totalInterestReturns\`: must include any "Wise Interest" transactions from the new account
   - Import the new data files and add them to the relevant \`.reduce()\` calculations

### Cards page (\`src/pages/Cards.tsx\`) — if cards are connected

8. **Add new card entries** to the Cards page data for the new account's cards. Each card needs a last-4-digits number, variant style, and account association.

### Card visuals (\`src/pages/CurrentAccount.tsx\`)

9. **Add CardThumbnail variant** — If the new account has cards with a unique colour, add a new variant to the \`CardThumbnail\` component and its CSS class \`card-thumbnail--<variant>\` in \`src/styles.css\`.

Do not change any existing account data, transactions, or balances. Only add new data alongside what already exists.`;

const PROMPT_UPDATE_TRANSACTIONS = `Add new transactions to ALL accounts (Consumer/Personal and Business) across ALL their currencies, bringing the transaction history up to today's date. Then update every balance, total, and calculation in the prototype so all numbers add up correctly.

Today's date is: **[today's date will be inserted — check the current date when running this prompt]**.

---

## Current state of the prototype

### Consumer/Personal account
The personal account has 4 currencies: **GBP** (£217.51), **EUR** (€233.70), **USD** ($224.79), **CAD** (C$0.00).

Transactions are in \`src/data/transactions.tsx\`. The most recent transactions are dated "Today" (which was the date the prototype was last updated). The transaction dates in the file currently run from "3 February" up to "Today".

**IMPORTANT: Re-dating existing transactions.** The existing "Today" and "Yesterday" transactions were written relative to the date the prototype was last built. Before adding new transactions:
1. Work out what calendar date the existing "Today" and "Yesterday" refer to (look at surrounding dated transactions for context — e.g. if the previous date is "12 February", then "Yesterday" is likely "13 February" and "Today" is "14 February").
2. Replace the literal \`'Today'\` and \`'Yesterday'\` strings on those existing transactions with their actual \`'DD Month'\` date (e.g. \`'14 February'\`).
3. Then add your new transactions at the top, using \`'Today'\` and \`'Yesterday'\` relative to the **current** date.
This ensures old transactions get pushed down the list with correct dates rather than having multiple "Today" groups.

**Personal currencies with interest:**
- GBP has \`hasInterest: true\` at 3.26% — this means it earns interest. Include periodic **"Wise Interest"** transactions (small amounts like £0.02–£0.05, using the \`<Plus size={24} />\` icon, subtitle "Added", \`isPositive: true\`). These should appear every few days.
- EUR, USD, CAD — no interest/stocks flags. No interest transactions needed.

### Business account
The business account has 4 currencies: **GBP** (£6,841.22), **USD** ($1,888.38), **EUR** (€1,202.07), **SGD** (S$345.88).

Transactions are in \`src/data/business-transactions.tsx\`. The most recent are dated "Today"/"Yesterday". Apply the same re-dating logic as personal: replace existing "Today"/"Yesterday" with their actual calendar dates, then add new transactions with "Today"/"Yesterday" relative to the current date.

**Business does NOT have any currencies with interest or stocks.** Do not add any "Wise Interest" transactions to business.

### Taxes account (Business only)
Single currency: **GBP** (£5,000.00). Transactions in \`src/data/taxes-data.tsx\`. Only has one transaction currently. You can optionally add a small number of tax-related moves (e.g. moving money from current account to taxes).

---

## Transaction rules and patterns

### Transaction types

Each transaction has: \`name\`, \`amount\` (string), \`isPositive\` (boolean), \`date\` (string), \`currency\` (string), and optionally \`subtitle\`, \`icon\`, \`imgSrc\`, \`amountSub\`, \`conversion\`.

1. **Spend (merchant purchase)** — money leaving the account to a business
   - \`isPositive: false\`
   - \`imgSrc: logoUrl('domain.com')\` — use the \`logoUrl\` helper with the merchant's real domain
   - No icon (icon is replaced by the logo image)
   - No subtitle for personal, \`subtitle: 'Spent by you'\` for business
   - Amount format: \`'23.99 GBP'\` (no minus sign in the string — the \`isPositive: false\` handles display)
   - Examples: Tesco, Amazon, Netflix, Spotify, Uber, Deliveroo, McDonald's

2. **Send (person-to-person or bill payment)** — money sent to a person or company
   - \`isPositive: false\`
   - \`icon: <Send size={24} />\`
   - \`subtitle: 'Sent'\` (personal) or \`subtitle: 'Sent by you'\` (business)
   - Amount format: \`'189.93 GBP'\`
   - Examples: HMRC, Sarah Chen, Christie Davis

3. **Receive (incoming payment)** — money received from a person or company
   - \`isPositive: true\`
   - \`icon: <Receive size={24} />\`
   - Amount format: \`'+ 199.66 GBP'\` (with + prefix)
   - No subtitle typically
   - Examples: Olivia Hartley, Berry Design, Acme Corp, salary payments

4. **Add (top-up / deposit)** — money added to the account
   - \`isPositive: true\`
   - \`icon: <Plus size={24} />\`
   - \`subtitle: 'Added'\` (personal) or \`subtitle: 'Added by you'\` (business)
   - Amount format: \`'+ 500.00 GBP'\`

5. **Convert (currency exchange)** — moving money between currencies
   - \`isPositive: false\` (from the source currency's perspective on the main transaction list)
   - \`icon: <Convert size={24} />\`
   - \`subtitle: 'Moved'\` (personal) or \`subtitle: 'Moved by you'\` (business)
   - \`amount: '188.00 GBP'\`, \`amountSub: '240.28 USD'\`
   - Must include \`conversion\` object: \`{ fromCurrency: 'GBP', toCurrency: 'USD', fromAmount: '188.00 GBP', toAmount: '240.28 USD' }\`
   - The \`currency\` field should be set to the **source** currency
   - The \`getTransactionsForCurrency()\` function automatically shows conversions on both currency pages with correct perspective (debit on source, credit on destination)
   - **Use realistic exchange rates** (e.g. GBP to EUR ≈ 1.17, GBP to USD ≈ 1.27, GBP to SGD ≈ 1.70)

6. **Wise Interest (personal GBP only)** — interest earned
   - \`isPositive: true\`
   - \`icon: <Plus size={24} />\`
   - \`name: 'Wise Interest'\`, \`subtitle: 'Added'\`
   - Amount format: \`'+ 0.03 GBP'\` (small amounts, £0.01–£0.05)
   - Only on personal GBP. **Never on business.**

### Date format
- Use \`'Today'\` and \`'Yesterday'\` for the two most recent days
- Use \`'DD Month'\` format for older dates (e.g. \`'17 February'\`, \`'3 March'\`)
- Transactions must be in **reverse chronological order** (newest first)
- Group transactions by date with a comment showing the date and per-currency totals (see existing comments like \`// Today — GBP: +199.66 -147.30 -8.49\`)

### Logo helper
Merchant logos use: \`logoUrl('domain.com')\` which is defined as:
\`\`\`ts
const logoUrl = (domain: string) => \`https://img.logo.dev/\${domain}?token=\${LOGO_DEV_TOKEN}&size=64&format=png\`;
\`\`\`
Use real company domains. The \`LOGO_DEV_TOKEN\` is already defined in \`transactions.tsx\` and imported in \`business-transactions.tsx\`.

### Realistic patterns
- Personal: mix of small daily purchases (£2–50), occasional larger payments (£100–300), periodic receives from friends/employer, interest every few days on GBP
- Business: client invoice payments received (£1,000–5,000), SaaS subscriptions (USD), supplier payments, occasional currency conversions, team expense purchases
- Include transactions across multiple currencies, not just GBP
- CAD (personal) currently has £0 balance — you may leave it empty or add a small conversion into it

---

## Files to update

### 1. Transaction data files
- **\`src/data/transactions.tsx\`** — First, re-date any existing "Today"/"Yesterday" strings to their actual calendar dates (e.g. \`'14 February'\`). Then add new personal transactions at the TOP of the array (newest first), using "Today" and "Yesterday" for the current date.
- **\`src/data/business-transactions.tsx\`** — Same: re-date existing "Today"/"Yesterday", then add new business transactions at the TOP.
- **\`src/data/taxes-data.tsx\`** — Optionally add 1–2 tax-related transactions.

### 2. Currency balance files
After adding transactions, recalculate each currency's balance by summing all credits and debits:
- **\`src/data/currencies.ts\`** — Update \`balance\` and \`formattedBalance\` for each personal currency (GBP, EUR, USD, CAD). The \`totalAccountBalance\` is computed automatically via \`.reduce()\`.
- **\`src/data/business-currencies.ts\`** — Update \`balance\` and \`formattedBalance\` for each business currency (GBP, USD, EUR, SGD). The \`businessTotalAccountBalance\` is computed automatically.
- **\`src/data/taxes-data.tsx\`** — Update \`taxesTotalBalance\` and the GBP currency balance if you added transactions.

### 3. Verify these display correctly (no code changes needed if totals are computed)
- **Home page** (\`src/pages/Home.tsx\`) — \`TotalBalanceHeader\` and \`MultiCurrencyAccountCard\` use the imported balances, so they update automatically.
- **CurrentAccount page** (\`src/pages/CurrentAccount.tsx\`) — Currency list and transaction list pull from the data files.
- **CurrencyPage** (\`src/pages/CurrencyPage.tsx\`) — Uses \`getTransactionsForCurrency()\` to filter transactions per currency, including both sides of conversions.
- **Insights page** (\`src/pages/Insights.tsx\`) — Computes \`totalBalance\`, \`cashBalance\`, \`totalInterestReturns\` (sum of all "Wise Interest" positive transactions), and \`spentThisMonth\` (sum of all debit non-conversion transactions). These are calculated from the data files automatically.

### 4. Validation checklist
After making changes, verify:
- [ ] Every currency \`balance\` equals: (sum of all positive transaction amounts) minus (sum of all negative transaction amounts) for that currency, starting from the original starting balance before any transactions
- [ ] For conversions: the source currency loses the \`fromAmount\`, the destination currency gains the \`toAmount\`
- [ ] \`formattedBalance\` matches \`balance\` with correct formatting (comma thousands, 2 decimal places)
- [ ] \`taxesTotalBalance\` matches the taxes GBP balance
- [ ] Transactions are in strict reverse chronological order
- [ ] "Today" and "Yesterday" are used for the correct dates relative to the current date
- [ ] Wise Interest transactions only appear in personal GBP, not in business
- [ ] All amounts use the correct currency code suffix (e.g. \`'GBP'\`, \`'USD'\`)
- [ ] Positive amounts have \`'+ '\` prefix in the amount string, negative amounts do not have a \`'-'\` prefix (the UI handles the minus display via \`isPositive: false\`)

Do not change any component code, styling, navigation, or page structure. Only update data files and balance values.`;

const PROMPT_SET_ASSETS = `Enable interest or stocks on a currency in this Wise prototype.

Before making changes, ask the user:

1. **Which account?** — Personal or Business? (Note: the existing prototype only shows interest/stocks features on **personal** accounts. Business accounts do not display interest rate cards, available balance lines, or diagonal flag avatars.)

2. **Which currency?** — Which currency code should have interest or stocks enabled? (e.g. USD, EUR, CAD, SGD). Currently only **GBP** on personal has \`hasInterest: true\` at 3.26%.

3. **Interest, stocks, or both?** — Ask whether the currency should have:
   - \`hasInterest: true\` — earns interest (shows rate card, interest disclaimer, interest list item)
   - \`hasStocks: true\` — invested in stocks (shows rate card, available balance line, diagonal avatar with Rewards icon)
   - Both — shows all of the above

4. **What interest rate?** — Ask for the rate string, e.g. \`'4.25%'\`. This appears on the InterestRateCard.

5. **What are the total returns?** — A string like \`'+1.23 USD'\` shown on the Insights page.

---

## What changes when \`hasStocks\` or \`hasInterest\` is set

### Data file: \`src/data/currencies.ts\` (personal) or \`src/data/business-currencies.ts\` (business)

Update the currency object to add:
\`\`\`ts
{
  code: 'USD',
  // ... existing fields ...
  hasStocks: true,        // enables stocks features
  hasInterest: true,      // enables interest features
  interestRate: '4.25%',  // shown on the InterestRateCard
  availableBalance: 1793.96, // not directly used — the available balance line is calculated as 95% of balance
  totalReturns: '+1.23 USD', // shown on Insights page
}
\`\`\`

### What each flag controls (all automatic — no component changes needed):

#### \`hasStocks: true\` triggers:
1. **MultiCurrencyAccountCard** (\`src/components/MultiCurrencyAccountCard.tsx\`) — The currency's balance row switches from a simple flag avatar to a **diagonal AvatarLayout** (flag + Rewards icon stacked diagonally). This happens automatically via the \`cd?.hasStocks\` check.

2. **AccountPageHeader** (\`src/components/AccountPageHeader.tsx\`) — When the user navigates to that currency's page, an **"available" subheading** appears below the main balance amount showing \`"{95% of balance} {CODE} available"\` with a 16px \`?\` info button. This is passed via \`hasStocks\` and \`availableBalance\` props from CurrencyPage.

3. **CurrencyPage** (\`src/pages/CurrencyPage.tsx\`) — The \`showRateCard\` variable becomes \`true\` (it checks \`currency.hasStocks || currency.hasInterest\`). This shows:
   - **InterestRateCard** above the segmented control on mobile, and in the sidebar on desktop
   - **Interest disclaimer** text below the rate card
   - The rate card and disclaimer are hidden inside the Options tab on mobile (CSS class \`currency-page__options-rate-card\`) since they're already shown above the tabs

#### \`hasInterest: true\` triggers:
1. **CurrencyPage** — Same as above: \`showRateCard\` becomes \`true\`, showing the InterestRateCard and disclaimer.
2. **InterestListItem** in the Options tab and sidebar — Renders differently based on whether interest is active.

#### Both flags together:
All of the above effects combine. The diagonal avatar, available balance line, rate card, and interest list item all appear.

### Transactions: Adding "Wise Interest" entries

If the currency earns interest, add **Wise Interest** transactions to the transaction data file:
\`\`\`tsx
{ name: 'Wise Interest', subtitle: labels.added, amount: '+ 0.02 USD', isPositive: true, icon: <Plus size={24} />, date: '12 February', currency: 'USD' },
\`\`\`
- Use small amounts (0.01–0.05 in the currency)
- Add them every few days
- Only on **personal** accounts, never on business
- The \`interestReturns\` on CurrencyPage is computed automatically by summing all "Wise Interest" transactions for that currency

### Insights page (\`src/pages/Insights.tsx\`)

The Insights page automatically computes \`totalInterestReturns\` by summing all "Wise Interest" positive transactions. If you've added Wise Interest transactions for the new currency, they'll be included automatically. The \`totalReturns\` field from the currency data is shown in the product breakdown section.

### Translation keys (already exist — no changes needed)
- \`currencyPage.available\`: "{amount} available" — shown in the AccountPageHeader
- \`currencyPage.variableRateLabel\`: "Variable rate"
- \`currencyPage.returnsThisMonth\`: "Returns this month"
- \`currencyPage.disclaimerInterest\`: Interest disclaimer text

### Validation checklist
After making changes, verify:
- [ ] The currency object in the data file has \`hasStocks\` and/or \`hasInterest\` set to \`true\`
- [ ] \`interestRate\` is a string like \`'4.25%'\`
- [ ] The MultiCurrencyAccountCard shows a diagonal avatar for that currency on the Home page
- [ ] Navigating to the currency page shows the InterestRateCard (mobile: above tabs, desktop: in sidebar)
- [ ] If \`hasStocks\`, the "available" line appears below the balance with the \`?\` button
- [ ] Wise Interest transactions (if added) appear in the transaction list and are summed correctly
- [ ] The Insights page reflects the updated returns
- [ ] Business accounts are NOT affected (interest/stocks features only show when \`accountType === 'personal'\`)

Do not change any component code, styling, or page structure. Only update the currency data object and optionally add Wise Interest transactions.`;

const PROMPT_CHANGE_AMOUNTS = `Change the currencies and balances in this Wise prototype's accounts, then regenerate all transaction data to match.

Before making any changes, ask the user the following questions:

---

### Step 1: Which profile?
Which profile do you want to change?
- **Consumer/Personal**
- **Business**
- **Both**

### Step 2: Show current state
Based on the user's answer, list out what currently exists so they can see what they're changing:

**Consumer/Personal account** (if selected):
Current currencies in \`src/data/currencies.ts\`:
- **GBP** — £217.51 (British pound) — has stocks/interest enabled (\`hasStocks: true\`)
- **EUR** — €233.70 (Euro) — has interest (\`hasInterest: true\`, rate: 2.81%)
- **USD** — $224.79 (US dollar) — has interest (\`hasInterest: true\`, rate: 3.42%)
- **CAD** — C$0.00 (Canadian dollar) — empty, no interest

**Business account** (if selected):
Current currencies in \`src/data/business-currencies.ts\`:
- **GBP** — £6,841.22 (British pound)
- **USD** — $1,888.38 (US dollar) — has interest (\`hasInterest: true\`, rate: 3.42%)
- **EUR** — €1,202.07 (Euro) — has interest (\`hasInterest: true\`, rate: 2.81%)
- **SGD** — S$345.88 (Singapore dollar)

**Taxes jar** (business only, in \`src/data/taxes-data.tsx\`):
- **GBP** — £5,000.00

Note: these amounts may have changed since this prompt was written. Always check the actual data files for current values before presenting them to the user.

### Step 3: Main display currency for each account
Ask: **What should be the main/display currency for each account?**

There are two separate currency display settings:

1. **Account display currency** — the currency shown as the total on each account card and at the top of the CurrentAccount page header (e.g. "676.00 GBP"). This is the first currency in the account's currency array and is used for the \`totalAmount\` prop on \`MultiCurrencyAccountCard\` and the \`balanceFormatted\` in \`CurrentAccount.tsx\`. Currently GBP for both accounts.

2. **Home total balance currency** — the currency shown in the TotalBalanceHeader at the very top of the Home page (e.g. "676.00 GBP"). This is the user's home/locale currency and represents the sum of ALL accounts converted to a single display currency. Currently hardcoded as GBP in \`Home.tsx\`. This could be different from an account's display currency.

Ask the user for both:
- "What currency should each account's total be displayed in?" (per account)
- "What currency should the overall total balance at the top of the Home page be shown in?" (global)

### Step 4: Ask for desired currencies and amounts
Ask the user to specify their desired setup for each account. They can:
- **Keep** existing currencies with different amounts
- **Remove** currencies they don't want
- **Add** new currencies (any valid currency code — make sure a flag SVG exists in \`public/flags/\` for it, or download one)
- **Change amounts** to whatever they want

For each currency they want, they should provide:
- Currency code (e.g. GBP, USD, EUR, JPY, BRL, etc.)
- Desired balance amount
- Whether it should have interest/stocks enabled (optional — ask if they want to keep or change existing settings)

### Step 5: Confirm and build
Summarise the changes back to the user before implementing. Show a clear before/after table.

---

## Implementation

### 1. Update currency data files

**\`src/data/currencies.ts\`** (personal) and/or **\`src/data/business-currencies.ts\`** (business):

For each currency in the user's list:
- Set \`code\`, \`name\` (full currency name), \`symbol\` (currency symbol)
- Set \`balance\` to the exact amount the user specified
- Set \`formattedBalance\` — formatted with comma thousands and 2 decimal places, suffixed with the code (e.g. \`'1,234.56 GBP'\`)
- Set \`accountDetails\` — generate a realistic-looking account number:
  - GBP: sort code + account number format (\`'23-14-70 · 46839215'\`)
  - EUR: IBAN format (\`'BE68 9670 3781 7624'\`)
  - USD: 10-digit account number (\`'8311094826'\`)
  - Other currencies: 10-12 digit number
- Preserve \`hasStocks\`, \`hasInterest\`, \`interestRate\`, \`totalReturns\` if the user wants to keep them, or update as requested

If adding a new currency that doesn't have a flag in \`public/flags/\`, download the SVG from the Wise CDN:
\`https://wise.com/web-art/assets/flags/{code}.svg\` (lowercase code) and save it to \`public/flags/{code}.svg\`.

The \`totalAccountBalance\` / \`businessTotalAccountBalance\` are computed automatically via \`.reduce()\` — no manual update needed.

### 2. Update display currencies

**Account display currency** (if changed from GBP):
- **\`src/data/currencies.ts\`** / **\`src/data/business-currencies.ts\`** — reorder the currencies array so the new main currency is **first**. It appears first in all currency lists.
- **\`src/pages/CurrentAccount.tsx\`** — The \`balanceFormatted\` variable appends \`' GBP'\` — change to the new account display currency code. Also update the currency symbol in \`totalAmount\` formatting. Update the GBP-specific interest rate check (\`c.code === 'GBP'\`) if needed.
- **\`src/pages/Home.tsx\`** — The \`MultiCurrencyAccountCard\` \`totalAmount\` prop uses \`£\` prefix — change the symbol to match the new account display currency (e.g. \`$\`, \`€\`).

**Home total balance currency** (if changed from GBP — this is separate from the account currency):
- **\`src/pages/Home.tsx\`** — \`TotalBalanceHeader\` has \`currency="GBP"\` — change to the new home currency code. Also update \`toLocaleString\` locale if appropriate.
- **\`src/pages/Insights.tsx\`** — Total balance display and currency labels use GBP — update to the new home currency.

### 3. Regenerate transaction data

This is the most important part. **Completely rewrite** the transaction arrays so they add up to the correct final balances.

**\`src/data/transactions.tsx\`** (personal) and/or **\`src/data/business-transactions.tsx\`** (business):

For each currency, create a realistic set of transactions that sum to the target balance. The approach:

1. Start with a large initial deposit (e.g. "Added" or "Received" transaction) that's larger than the final balance
2. Add a mix of debits (purchases, sends, conversions out) and credits (receives, conversions in, interest) over the date range
3. The net result (sum of all credits minus all debits) must equal the final balance exactly

**Transaction types to use** (see existing data for examples):
- **Spend**: \`isPositive: false\`, \`imgSrc: logoUrl('domain.com')\`, merchant purchase (Tesco, Amazon, Netflix, etc.)
- **Send**: \`isPositive: false\`, \`icon: <Send size={24} />\`, sent to a person
- **Receive**: \`isPositive: true\`, \`icon: <Receive size={24} />\`, received from a person/company
- **Add**: \`isPositive: true\`, \`icon: <Plus size={24} />\`, money added/deposited
- **Convert**: \`isPositive: false\` (source side), \`icon: <Convert size={24} />\`, with \`conversion\` object and \`amountSub\`. Use realistic exchange rates (GBP→EUR ≈ 1.17, GBP→USD ≈ 1.27)
- **Wise Interest** (personal only, on currencies with \`hasStocks\` or \`hasInterest\`): \`isPositive: true\`, \`icon: <Plus size={24} />\`, \`name: 'Wise Interest'\`, small amounts (0.01–0.05)

**Date rules:**
- Use \`'Today'\` and \`'Yesterday'\` for the two most recent days
- Use \`'DD Month'\` format for older dates (e.g. \`'17 February'\`)
- Reverse chronological order (newest first)
- Span roughly 3–4 weeks of history
- Add date comments grouping transactions (e.g. \`// Today — GBP: +199.66 -147.30\`)

**Transaction subtitle labels:**
The \`buildTransactions()\` and \`buildBusinessTransactions()\` functions receive a \`labels\` parameter with translated subtitle strings. Use these label references:
- \`labels.sent\` / \`labels.sentByYou\` — for sends
- \`labels.added\` / \`labels.addedByYou\` — for adds/deposits
- \`labels.moved\` / \`labels.movedByYou\` — for conversions
- \`labels.spentByYou\` — for business spend

**Amounts in transaction strings:**
- Positive amounts: prefix with \`'+ '\` (e.g. \`'+ 500.00 GBP'\`)
- Negative amounts: no prefix, no minus sign (e.g. \`'23.99 GBP'\`) — the \`isPositive: false\` flag handles the display

**If currencies were removed:** delete all transactions for that currency code from the array.

**If currencies were added:** create new transactions for that currency, including an initial deposit and realistic activity.

### 4. Update taxes data (if business was changed)

If the user changed business currencies, ask whether the **Taxes jar** (\`src/data/taxes-data.tsx\`) should also be updated. The taxes jar is a sub-account of business with its own isolated currency list and transactions.

### 5. Verification checklist

After making all changes, verify:
- [ ] Each currency's \`balance\` in the data file matches the user's requested amount exactly
- [ ] \`formattedBalance\` matches \`balance\` with correct formatting
- [ ] Sum of all transaction credits minus debits for each currency equals that currency's final balance
- [ ] For conversions: source currency loses \`fromAmount\`, destination gains \`toAmount\` — both sides accounted for
- [ ] Transactions are in strict reverse chronological order
- [ ] \`'Today'\` and \`'Yesterday'\` are used for the two most recent days
- [ ] Wise Interest transactions only appear on personal currencies that have \`hasStocks\` or \`hasInterest\`
- [ ] All positive amounts have \`'+ '\` prefix, negative amounts have no prefix
- [ ] Every currency referenced in transactions exists in the currency data array
- [ ] No transactions reference removed currencies
- [ ] New currencies have flag SVGs in \`public/flags/\`
- [ ] \`npx tsc --noEmit\` passes with no errors

### 6. Surfaces that update automatically

These surfaces pull from the data files and will update without code changes:
- **Home page** — TotalBalanceHeader, MultiCurrencyAccountCard (currency count, balances, total)
- **CurrentAccount page** — currency list, transaction list per currency
- **CurrencyPage** — balance, transactions, interest rate card
- **Insights page** — total balance, cash breakdown, spent this month, interest returns
- **Transactions page** — full transaction list with search and filters

Do not change any component code, styling, or page structure. Only update data files (currencies, transactions, taxes).`;
const PROMPT_PROJECT_CONTEXT = `You are working on a high-fidelity interactive prototype of the Wise app. Before making any changes, read and follow this context carefully.

## What this project is

A React + TypeScript + Vite prototype that replicates the Wise app's top-level surfaces for both consumer (personal) and business account types. It is NOT a production app — there are no real API calls, no authentication, no backend. All data is hardcoded in local data files. The purpose is design validation and testing of UI surfaces, flows, and interactions.

## What is already built

### Pages (\`src/pages/\`)
- **Home** — total balance header, action buttons (Send/Add/Request/Convert), multi-currency account cards carousel, tasks stack, notification cards, send again card, transactions preview, transfer calculator, promotion banners, rate alerts
- **Cards** — card display with actions and limits
- **Transactions** — full transaction list with search, date-grouped sections, filter chips (currencies)
- **Payments** — scheduled transfers, direct debits, recurring card payments, payment requests (personal) or bills/batch/invoices/payment links (business)
- **Recipients** — recent contacts + all recipients with search and filter chips
- **Insights** — account summary, spending breakdown, interest returns (business only)
- **Account** — profile, settings, navigation list items
- **Team** — business-only team management
- **CurrentAccount** — full account overview with 3 tabs (Currencies/Transactions/Options), currency list, transaction list
- **CurrencyPage** — individual currency detail with 2 tabs (Transactions/Options), rate card, spotlight items, interest/stocks support

### Components (\`src/components/\`)
Key shared components: \`MultiCurrencyAccountCard\`, \`TotalBalanceHeader\`, \`ActionButtonRow\`, \`TransferCalculator\`, \`TasksStack\`, \`TaskCard\`, \`SendAgainCard\`, \`PromotionBanner\`, \`EmptyAccountCard\`, \`Flag\`, \`Illustration\`, \`TopBar\`, \`SideNav\`, \`MobileNav\`, \`PrototypeSettings\`

### Data (\`src/data/\`)
- \`currencies.ts\` — personal account currencies (GBP, EUR, USD, CAD) with balances, interest/stocks flags
- \`business-currencies.ts\` — business account currencies (GBP, USD, EUR, SGD)
- \`transactions.tsx\` / \`business-transactions.tsx\` — transaction arrays built by factory functions
- \`taxes-data.tsx\` — taxes jar data (business only)
- \`recipients.tsx\` — recipient lists for both account types
- \`currency-rates.ts\` — 24 USD-base exchange rates
- \`nav.tsx\` — navigation items for personal and business

## Architecture

### Navigation
**No router library.** Navigation is state-driven:
- \`activeNavItem\` — string matching English nav labels (\`'Home'\`, \`'Cards'\`, etc.) for top-level pages
- \`subPage\` — union type for drill-down pages (CurrentAccount, CurrencyPage, etc.)
- The \`label\` field on NavItem is the **routing key** and must stay in English. A separate \`translationKey\` drives display text.

### State management
- \`AccountType = 'personal' | 'business'\` — toggled via settings or Account page, switches all data
- \`LanguageProvider\` — holds language, exposes \`t(key, vars?)\` for translations
- \`PrototypeNamesProvider\` — holds editable consumer/business names
- Prototype settings opened via gear button (bottom-right, hide with Ctrl+H)

### Responsive breakpoints
- **XL** (>=1160px): side nav, two-column layouts
- **LG** (840-1159px): XL content layout + hamburger menu (no side nav)
- **MD** (600-839px): single column, segmented tabs, hamburger menu
- **SM** (<600px): bottom tab bar, compact layouts, horizontal scroll actions

## What to use when building

### Components — ALWAYS use the design system
- **\`@transferwise/components\`** — Button, IconButton, ListItem, Field, Input, SelectInput, SegmentedControl, SearchInput, Badge, Drawer, Modal, Snackbar, etc. **Never build custom equivalents.**
- **\`@transferwise/icons\`** — all iconography
- **Local \`Flag\` component** (\`src/components/Flag.tsx\`) — for currency flags, NOT \`@wise/art\`
- **Local \`Illustration\` component** (\`src/components/Illustration.tsx\`) — for promo illustrations

### Typography — use DS classes
\`np-text-display-title\`, \`np-text-title-section\`, \`np-text-title-body\`, \`np-text-title-group\`, \`np-text-body-default\`, \`np-text-body-small\`, \`np-text-body-large\`, etc. **Never hardcode font sizes.**

### Colors — use CSS variables
\`var(--color-content-primary)\`, \`var(--color-content-secondary)\`, \`var(--color-background-neutral)\`, \`var(--color-border-neutral)\`, \`var(--color-sentiment-positive)\`, \`var(--color-sentiment-negative)\`, \`var(--color-interactive-primary)\`, etc. **Never hardcode hex values** except for brand-specific ones documented in currency data.

### Translations
- All user-facing text must use \`t()\` from \`useLanguage()\`
- Add keys to ALL translation files: \`en.ts\`, \`es.ts\`, \`de.ts\`, \`fr.ts\`
- Do NOT translate: names, currency codes, amounts, brand terms ("Wise", "Wisetag")

### Styling
- Add styles to \`src/styles.css\` using BEM-like class naming
- Follow existing responsive patterns (desktop/tablet/mobile breakpoints)
- Use \`section-card\` class for card containers

### Self-hosted assets
- Flags: \`public/flags/{code}.svg\` (lowercase)
- Illustrations: \`public/illustrations/\` (webp files)
- Card images: imported via \`import.meta.url\`

## Key conventions
- Transactions are built by factory functions that accept translated labels — they update when language changes
- Interest/stocks features are driven by boolean flags on currency objects (\`hasInterest\`, \`hasStocks\`)
- The "jar" prop (e.g. \`'taxes'\`) creates isolated sub-accounts with own data
- All component imports should use named exports from \`@transferwise/components\`
- Run \`npx tsc --noEmit\` to verify no type errors after changes
- Test in both light and dark themes, and at all three breakpoints

## CLAUDE.md
There is a detailed CLAUDE.md at the project root with full documentation. **Read it** before starting any work — it contains the authoritative reference for architecture, conventions, and known issues.`;

import { useTheme } from '@wise/components-theming';
import { usePrototypeNames } from '../context/PrototypeNames';
import { useLanguage, type Language } from '../context/Language';
import { currencyMeta } from '../data/currency-rates';
import { Flag } from './Flag';

export function PrototypeSettings() {
  const { isScreenModeDark, setScreenMode } = useTheme();
  const createSnackbar = useSnackbar();
  const { consumerName, setConsumerName, businessName, setBusinessName, consumerHomeCurrency, setConsumerHomeCurrency, businessHomeCurrency, setBusinessHomeCurrency } = usePrototypeNames();
  const { language, setLanguage, t } = useLanguage();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [animClass, setAnimClass] = useState('prototype-fab--hidden');
  const [isDragging, setIsDragging] = useState(false);

  // Drag state
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [positioned, setPositioned] = useState(false);
  const dragRef = useRef({
    offsetX: 0,
    offsetY: 0,
    startX: 0,
    startY: 0,
    moved: false,
  });
  const fabRef = useRef<HTMLButtonElement>(null);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    dragRef.current = {
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
      startX: e.clientX,
      startY: e.clientY,
      moved: false,
    };
    setIsDragging(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    const d = dragRef.current;

    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
      d.moved = true;
    }

    if (!positioned) setPositioned(true);
    setPos({
      x: e.clientX - d.offsetX,
      y: e.clientY - d.offsetY,
    });
  }, [isDragging, positioned]);

  const handlePointerUp = useCallback(() => {
    const wasDrag = dragRef.current.moved;
    setIsDragging(false);

    if (!wasDrag) {
      setDrawerOpen(true);
    }
  }, []);

  // Ctrl+H to hide/show
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === 'h') {
        e.preventDefault();
        setVisible((v) => {
          if (v) {
            setAnimClass('prototype-fab--hiding');
            setTimeout(() => setAnimClass('prototype-fab--hidden'), 200);
          } else {
            setPositioned(false);
            setAnimClass('prototype-fab--showing');
            setTimeout(() => setAnimClass(''), 400);
          }
          return !v;
        });
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const fabStyle: React.CSSProperties = positioned
    ? { left: pos.x, top: pos.y, bottom: 'auto', right: 'auto' }
    : {};

  const currentValue = isScreenModeDark ? 'dark' : 'light';
  const [accountType, setAccountType] = useState('consumer');

  const copyPrompt = (text: string) => {
    navigator.clipboard.writeText(text);
    createSnackbar({ text: 'Prompt copied.' } as any);
  };

  return (
    <>
      <button
        ref={fabRef}
        className={`prototype-fab${isDragging ? ' prototype-fab--dragging' : ''}${animClass ? ` ${animClass}` : ''}`}
        style={fabStyle}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        aria-label={t('settings.title')}
      >
        <Slider size={16} />
      </button>

      <Drawer
        open={drawerOpen}
        headerTitle={t('settings.title')}
        position="right"
        onClose={() => setDrawerOpen(false)}
      >
        <div style={{ overflowY: 'auto', flex: 1 }}>
        <p className="np-text-body" style={{ margin: '0 0 24px', color: 'var(--color-content-secondary)' }}>
          {t('settings.hideHint')}
        </p>
        <div style={{ padding: '24px 0' }}>
          <h3 className="np-text-title-body" style={{ margin: '0 0 16px' }}>{t('settings.visual')}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label className="np-text-title-group" style={{ display: 'block', marginBottom: 8 }}>
                {t('settings.appearance')}
              </label>
              <SelectInput
                size="md"
                placeholder="Choose theme..."
                value={currentValue}
                onChange={(val) => {
                  if (val === 'light' || val === 'dark') {
                    setScreenMode(val);
                  }
                }}
                items={[
                  { type: 'option', value: 'light' },
                  { type: 'option', value: 'dark' },
                ]}
                renderValue={(val) => (
                  <SelectInputOptionContent title={val === 'light' ? t('settings.light') : t('settings.dark')} />
                )}
              />
            </div>
            <div>
              <label className="np-text-title-group" style={{ display: 'block', marginBottom: 8 }}>
                {t('settings.language')}
              </label>
              <SelectInput
                size="md"
                placeholder="Choose language..."
                value={language}
                onChange={(val) => setLanguage(val as Language)}
                items={[
                  { type: 'option', value: 'en' },
                  { type: 'option', value: 'es' },
                  { type: 'option', value: 'de' },
                  { type: 'option', value: 'fr' },
                ]}
                renderValue={(val) => (
                  <SelectInputOptionContent title={
                    { en: 'English', es: 'Español', de: 'Deutsch', fr: 'Français' }[val] ?? val
                  } />
                )}
              />
            </div>
          </div>
        </div>
        <hr style={{ border: 'none', borderTop: '1px solid var(--color-border-neutral)', margin: 0 }} />
        <div style={{ padding: '24px 0' }}>
          <h3 className="np-text-title-body" style={{ margin: '0 0 16px' }}>{t('settings.accounts')}</h3>
          <SegmentedControl
            name="account-type"
            value={accountType}
            mode="input"
            segments={[
              { id: 'consumer', label: t('settings.consumer'), value: 'consumer' },
              { id: 'business', label: t('settings.business'), value: 'business' },
            ]}
            onChange={setAccountType}
          />
          <div style={{ marginTop: 16, marginBottom: 0 }}>
            {accountType === 'consumer' ? (
              <Field label={t('settings.name')}>
                <Input
                  value={consumerName}
                  onChange={(e) => setConsumerName(e.target.value)}
                />
              </Field>
            ) : (
              <Field label={t('settings.name')}>
                <Input
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                />
              </Field>
            )}
          </div>
          <div style={{ marginTop: 8 }}>
            <label className="np-text-title-group" style={{ display: 'block', marginBottom: 8 }}>
              {t('settings.homeCurrency')}
            </label>
            <SelectInput
              size="md"
              placeholder="Choose currency..."
              value={accountType === 'consumer' ? consumerHomeCurrency : businessHomeCurrency}
              onChange={(val) => accountType === 'consumer' ? setConsumerHomeCurrency(val as string) : setBusinessHomeCurrency(val as string)}
              items={Object.keys(currencyMeta).map((code) => ({
                type: 'option' as const,
                value: code,
              }))}
              renderValue={(val) => {
                const meta = currencyMeta[val];
                if (!meta) return <SelectInputOptionContent title={val} />;
                return (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Flag code={meta.code} intrinsicSize={20} />
                    <span>{meta.name} · {meta.code}</span>
                  </span>
                );
              }}
            />
          </div>
        </div>
        <hr style={{ border: 'none', borderTop: '1px solid var(--color-border-neutral)', margin: 0 }} />
        <div style={{ padding: '24px 0' }}>
          <h3 className="np-text-title-body" style={{ margin: '0 0 4px' }}>{t('settings.prompts')}</h3>
          <p className="np-text-body-default" style={{ margin: '0 0 16px', color: 'var(--color-content-secondary)' }}>{t('settings.promptsSub')}</p>
          <div>
            <ListItem
              title={t('settings.projectContext')}
              subtitle={t('settings.projectContextSub')}
              media={<ListItem.AvatarView size={40}><img src="/Claude.png" alt="Claude" style={{ width: 40, height: 40, borderRadius: '50%' }} /></ListItem.AvatarView>}
              control={<Button v2 priority="secondary-neutral" size="sm" onClick={() => copyPrompt(PROMPT_PROJECT_CONTEXT)}>Copy</Button>}
            />
            <ListItem
              title={t('settings.newFlow')}
              subtitle={t('settings.newFlowSub')}
              media={<ListItem.AvatarView size={40}><img src="/Claude.png" alt="Claude" style={{ width: 40, height: 40, borderRadius: '50%' }} /></ListItem.AvatarView>}
              control={<Button v2 priority="secondary-neutral" size="sm" onClick={() => copyPrompt(PROMPT_NEW_FLOW)}>Copy</Button>}
            />
            <ListItem
              title={t('settings.switchProfile')}
              subtitle={t('settings.switchProfileSub')}
              media={<ListItem.AvatarView size={40}><img src="/Claude.png" alt="Claude" style={{ width: 40, height: 40, borderRadius: '50%' }} /></ListItem.AvatarView>}
              control={<Button v2 priority="secondary-neutral" size="sm" onClick={() => copyPrompt(PROMPT_SWITCH_ACCOUNT)}>Copy</Button>}
            />
            <ListItem
              title={t('settings.newAccount')}
              subtitle={t('settings.newAccountSub')}
              media={<ListItem.AvatarView size={40}><img src="/Claude.png" alt="Claude" style={{ width: 40, height: 40, borderRadius: '50%' }} /></ListItem.AvatarView>}
              control={<Button v2 priority="secondary-neutral" size="sm" onClick={() => copyPrompt(PROMPT_NEW_ACCOUNT)}>Copy</Button>}
            />
            <ListItem
              title={t('settings.updateTransactions')}
              subtitle={t('settings.updateTransactionsSub')}
              media={<ListItem.AvatarView size={40}><img src="/Claude.png" alt="Claude" style={{ width: 40, height: 40, borderRadius: '50%' }} /></ListItem.AvatarView>}
              control={<Button v2 priority="secondary-neutral" size="sm" onClick={() => copyPrompt(PROMPT_UPDATE_TRANSACTIONS)}>Copy</Button>}
            />
            <ListItem
              title={t('settings.setAssets')}
              subtitle={t('settings.setAssetsSub')}
              media={<ListItem.AvatarView size={40}><img src="/Claude.png" alt="Claude" style={{ width: 40, height: 40, borderRadius: '50%' }} /></ListItem.AvatarView>}
              control={<Button v2 priority="secondary-neutral" size="sm" onClick={() => copyPrompt(PROMPT_SET_ASSETS)}>Copy</Button>}
            />
            <ListItem
              title={t('settings.changeAmounts')}
              subtitle={t('settings.changeAmountsSub')}
              media={<ListItem.AvatarView size={40}><img src="/Claude.png" alt="Claude" style={{ width: 40, height: 40, borderRadius: '50%' }} /></ListItem.AvatarView>}
              control={<Button v2 priority="secondary-neutral" size="sm" onClick={() => copyPrompt(PROMPT_CHANGE_AMOUNTS)}>Copy</Button>}
            />
          </div>
        </div>
        </div>
      </Drawer>
    </>
  );
}
