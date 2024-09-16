from decimal import Decimal, getcontext

def calculate_pi(n):
    getcontext().prec = n + 10
    pi = Decimal(0)
    for k in range(n):
        pi += (Decimal(1) / (16 ** k)) * (
            (Decimal(4) / (8 * k + 1)) -
            (Decimal(2) / (8 * k + 4)) -
            (Decimal(1) / (8 * k + 5)) -
            (Decimal(1) / (8 * k + 6))
        )
    return pi

def main():
    n = int(input("Enter the number of decimal places (Don't recomment going above 10000): "))
    pi = calculate_pi(n)
    print(pi)

if __name__ == "__main__":
    main()