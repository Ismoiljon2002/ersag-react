export const formatNumber = (number) => {
    const formattedNumber = new Intl.NumberFormat('en-US', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(number);

    return formattedNumber;
};