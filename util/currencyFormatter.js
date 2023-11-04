export function formatToCurrency(number, NumOfDecimal){
    // Format the number as currency
    const formatter = new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP', // Change to the appropriate currency code
        minimumFractionDigits: NumOfDecimal ?? 2, // Specify the number of decimal places
    });
    
    return formatter.format(number);
}