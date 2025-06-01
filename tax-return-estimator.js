document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('taxReturnForm');
    const result = document.getElementById('calculatorResult');

    // Tax rates for 2023-24
    const taxRates = [
        { threshold: 18200, rate: 0 },
        { threshold: 45000, rate: 0.19 },
        { threshold: 120000, rate: 0.325 },
        { threshold: 180000, rate: 0.37 },
        { threshold: Infinity, rate: 0.45 }
    ];

    // Medicare levy rate
    const medicareRate = 0.02;

    // HELP/HECS repayment rates
    const hecsRates = [
        { threshold: 48092, rate: 0 },
        { threshold: 55150, rate: 0.01 },
        { threshold: 61266, rate: 0.02 },
        { threshold: 64942, rate: 0.025 },
        { threshold: 68894, rate: 0.03 },
        { threshold: 72908, rate: 0.035 },
        { threshold: 77020, rate: 0.04 },
        { threshold: 81364, rate: 0.045 },
        { threshold: 85990, rate: 0.05 },
        { threshold: 91038, rate: 0.055 },
        { threshold: 96430, rate: 0.06 },
        { threshold: 102305, rate: 0.065 },
        { threshold: 108739, rate: 0.07 },
        { threshold: 115921, rate: 0.075 },
        { threshold: 123090, rate: 0.08 },
        { threshold: 130639, rate: 0.085 },
        { threshold: 138817, rate: 0.09 },
        { threshold: 147685, rate: 0.095 },
        { threshold: 157418, rate: 0.1 },
        { threshold: Infinity, rate: 0.1 }
    ];

    function calculateTax(income) {
        let tax = 0;
        let remainingIncome = income;

        for (let i = 0; i < taxRates.length; i++) {
            const currentRate = taxRates[i];
            const previousThreshold = i > 0 ? taxRates[i - 1].threshold : 0;
            
            if (income > previousThreshold) {
                const taxableAmount = Math.min(remainingIncome, currentRate.threshold - previousThreshold);
                tax += taxableAmount * currentRate.rate;
                remainingIncome -= taxableAmount;
            }
        }

        return tax;
    }

    function calculateHecsRepayment(income) {
        for (let i = 0; i < hecsRates.length; i++) {
            if (income <= hecsRates[i].threshold) {
                return income * hecsRates[i].rate;
            }
        }
        return 0;
    }

    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-AU', {
            style: 'currency',
            currency: 'AUD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form values
        const grossIncome = parseFloat(document.getElementById('grossIncome').value) || 0;
        const taxPaid = parseFloat(document.getElementById('taxPaid').value) || 0;
        const workExpenses = parseFloat(document.getElementById('workExpenses').value) || 0;
        const charity = parseFloat(document.getElementById('charity').value) || 0;
        const education = parseFloat(document.getElementById('education').value) || 0;
        const medical = parseFloat(document.getElementById('medical').value) || 0;
        const interest = parseFloat(document.getElementById('interest').value) || 0;
        const dividends = parseFloat(document.getElementById('dividends').value) || 0;
        const rental = parseFloat(document.getElementById('rental').value) || 0;
        const other = parseFloat(document.getElementById('other').value) || 0;
        const hasHecs = document.getElementById('hecsYes').checked;

        // Calculate totals
        const totalDeductions = workExpenses + charity + education + medical;
        const additionalIncome = interest + dividends + rental + other;
        const totalIncome = grossIncome + additionalIncome;
        const taxableIncome = totalIncome - totalDeductions;

        // Calculate tax components
        const incomeTax = calculateTax(taxableIncome);
        const medicareLevy = taxableIncome * medicareRate;
        const hecsRepayment = hasHecs ? calculateHecsRepayment(taxableIncome) : 0;
        const totalTax = incomeTax + medicareLevy + hecsRepayment;
        const estimatedRefund = taxPaid - totalTax;

        // Update result display
        document.getElementById('totalIncome').textContent = formatCurrency(totalIncome);
        document.getElementById('totalDeductions').textContent = formatCurrency(totalDeductions);
        document.getElementById('taxableIncome').textContent = formatCurrency(taxableIncome);
        document.getElementById('taxPayable').textContent = formatCurrency(totalTax);
        document.getElementById('taxPaid').textContent = formatCurrency(taxPaid);
        document.getElementById('estimatedRefund').textContent = formatCurrency(estimatedRefund);

        // Show results with animation
        result.classList.add('active');
        result.style.display = 'block';
    });
}); 