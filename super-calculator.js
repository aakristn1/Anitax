document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('superCalculatorForm');
    const result = document.getElementById('calculatorResult');

    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-AU', {
            style: 'currency',
            currency: 'AUD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    }

    function calculateSuperProjection(data) {
        const {
            currentAge,
            retirementAge,
            currentBalance,
            annualSalary,
            employerContribution,
            personalContribution,
            investmentReturn,
            inflationRate
        } = data;

        const yearsToRetirement = retirementAge - currentAge;
        const totalContributionRate = (employerContribution + personalContribution) / 100;
        const annualContribution = annualSalary * totalContributionRate;
        const monthlyContribution = annualContribution / 12;
        
        let balance = currentBalance;
        let totalContributions = 0;
        let investmentEarnings = 0;

        // Calculate year by year
        for (let year = 0; year < yearsToRetirement; year++) {
            // Add contributions
            balance += annualContribution;
            totalContributions += annualContribution;

            // Add investment returns
            const yearEarnings = balance * (investmentReturn / 100);
            balance += yearEarnings;
            investmentEarnings += yearEarnings;
        }

        // Calculate inflation adjusted balance
        const inflationFactor = Math.pow(1 + (inflationRate / 100), yearsToRetirement);
        const inflationAdjustedBalance = balance / inflationFactor;

        // Calculate monthly income for 30 years
        const monthlyWithdrawal = balance / (30 * 12);

        return {
            yearsToRetirement,
            totalContributions,
            investmentEarnings,
            projectedBalance: balance,
            inflationAdjustedBalance,
            monthlyIncome: monthlyWithdrawal
        };
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form values
        const data = {
            currentAge: parseInt(document.getElementById('currentAge').value) || 0,
            retirementAge: parseInt(document.getElementById('retirementAge').value) || 0,
            currentBalance: parseFloat(document.getElementById('currentBalance').value) || 0,
            annualSalary: parseFloat(document.getElementById('annualSalary').value) || 0,
            employerContribution: parseFloat(document.getElementById('employerContribution').value) || 0,
            personalContribution: parseFloat(document.getElementById('personalContribution').value) || 0,
            investmentReturn: parseFloat(document.getElementById('investmentReturn').value) || 0,
            inflationRate: parseFloat(document.getElementById('inflationRate').value) || 0
        };

        // Validate inputs
        if (data.currentAge >= data.retirementAge) {
            alert('Retirement age must be greater than current age');
            return;
        }

        // Calculate projections
        const projection = calculateSuperProjection(data);

        // Update result display
        document.getElementById('yearsToRetirement').textContent = projection.yearsToRetirement;
        document.getElementById('totalContributions').textContent = formatCurrency(projection.totalContributions);
        document.getElementById('investmentEarnings').textContent = formatCurrency(projection.investmentEarnings);
        document.getElementById('projectedBalance').textContent = formatCurrency(projection.projectedBalance);
        document.getElementById('inflationAdjustedBalance').textContent = formatCurrency(projection.inflationAdjustedBalance);
        document.getElementById('monthlyIncome').textContent = formatCurrency(projection.monthlyIncome);

        // Show results with animation
        result.classList.add('active');
        result.style.display = 'block';
    });

    // Add input validation
    const inputs = form.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.value < 0) {
                this.value = 0;
            }
        });
    });

    // Add age validation
    document.getElementById('currentAge').addEventListener('input', function() {
        const retirementAge = document.getElementById('retirementAge');
        if (parseInt(this.value) >= parseInt(retirementAge.value)) {
            retirementAge.value = parseInt(this.value) + 1;
        }
    });

    document.getElementById('retirementAge').addEventListener('input', function() {
        const currentAge = document.getElementById('currentAge');
        if (parseInt(this.value) <= parseInt(currentAge.value)) {
            this.value = parseInt(currentAge.value) + 1;
        }
    });
}); 