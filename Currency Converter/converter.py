import json
import urllib.request

API_URL = "https://api.frankfurter.dev/v1/latest"

BACKUP_RATES = {
    "USD": 1.0,
    "EUR": 0.92,
    "GBP": 0.79,
    "ZAR": 18.5,
    "JPY": 150.0,
    "AUD": 1.52,
    "CAD": 1.37,
}


def get_live_rate(from_currency, to_currency):
    """Ask the internet for today's exchange rate. Returns a number."""
    url = API_URL + "?base=" + from_currency + "&symbols=" + to_currency
    response = urllib.request.urlopen(url, timeout=10)
    data = json.loads(response.read())
    return data["rates"][to_currency]


def get_backup_rate(from_currency, to_currency):
    """Work out a rate from the backup list. Returns a number or None."""
    if from_currency not in BACKUP_RATES or to_currency not in BACKUP_RATES:
        return None
    # go from one currency to USD, then from USD to the other currency
    return BACKUP_RATES[to_currency] / BACKUP_RATES[from_currency]


def ask_for_amount():
    """Keep asking until the user types a valid number."""
    while True:
        text = input("Amount to convert: ")
        try:
            amount = float(text)
            if amount < 0:
                print("Please enter a positive number.")
            else:
                return amount
        except ValueError:
            print("That is not a number. Try again, for example 100 or 25.50")


def convert_once():
    amount = ask_for_amount()
    from_currency = input("From currency (for example USD): ").strip().upper()
    to_currency = input("To currency (for example EUR): ").strip().upper()

    using_backup = False

    try:
        rate = get_live_rate(from_currency, to_currency)
    except Exception:
        # Something went wrong: no internet, a wrong currency code, etc.
        rate = get_backup_rate(from_currency, to_currency)
        using_backup = True

    if rate is None:
        print("Sorry, I could not find a rate for", from_currency, "to", to_currency)
        print("Check the currency codes (they are 3 letters, like USD or EUR).")
        return

    result = amount * rate
    print()
    print(round(amount, 2), from_currency, "=", round(result, 2), to_currency)
    print("Rate: 1", from_currency, "=", round(rate, 4), to_currency)

    if using_backup:
        print("(Could not reach the live service, so these are rough sample rates.)")


def main():
    print("=== Currency Converter ===")
    keep_going = "yes"

    while keep_going == "yes":
        print()
        convert_once()
        print()
        keep_going = input("Convert another? (yes/no): ").strip().lower()

    print("Goodbye!")


main()