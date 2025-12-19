export function calcFlatInstallment({ totalPrice, dpAmount, months, annualRate = 0.12 }) {
  const principal = Math.max(totalPrice - dpAmount, 0);
  const years = months / 12;

  // bunga flat: interest dihitung dari pokok awal selama tenor
  const totalInterest = principal * annualRate * years;
  const totalPayable = principal + totalInterest;

  const monthly = months > 0 ? totalPayable / months : 0;

  return {
    principal,
    totalInterest,
    totalPayable,
    monthly,
  };
}
