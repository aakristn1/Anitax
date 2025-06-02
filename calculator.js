document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('taxCalculatorForm');
    const resultDiv = document.getElementById('calculatorResult');
    
    // Tax thresholds and rates for 2023-24
    const taxThresholds = [
        { threshold: 0, rate: 0 },
        { threshold: 18200, rate: 0.19 },
        { threshold: 45000, rate: 0.325 },
        { threshold: 120000, rate: 0.37 },
        { threshold: 180000, rate: 0.45 }
    ];
    
    // Medicare Levy rate
    const medicareLevyRate = 0.02;
    
    // HELP/HECS repayment rates
    const hecsRates = [
        { threshold: 0, rate: 0 },
        { threshold: 48092, rate: 0.01 },
        { threshold: 55641, rate: 0.02 },
        { threshold: 58922, rate: 0.025 },
        { threshold: 62294, rate: 0.03 },
        { threshold: 65992, rate: 0.035 },
        { threshold: 69982, rate: 0.04 },
        { threshold: 74303, rate: 0.045 },
        { threshold: 78972, rate: 0.05 },
        { threshold: 84030, rate: 0.055 },
        { threshold: 89532, rate: 0.06 },
        { threshold: 95516, rate: 0.065 },
        { threshold: 101900, rate: 0.07 },
        { threshold: 108593, rate: 0.075 },
        { threshold: 115738, rate: 0.08 },
        { threshold: 123388, rate: 0.085 },
        { threshold: 131601, rate: 0.09 },
        { threshold: 140449, rate: 0.095 },
        { threshold: 150000, rate: 0.1 }
    ];
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const grossIncome = parseFloat(document.getElementById('grossIncome').value) || 0;
        const deductions = parseFloat(document.getElementById('deductions').value) || 0;
        const hasHecs = document.querySelector('input[name="hecs"]:checked').value === '1';
        
        // Calculate taxable income
        const taxableIncome = Math.max(0, grossIncome - deductions);
        
        // Calculate income tax
        let incomeTax = 0;
        for (let i = 0; i < taxThresholds.length - 1; i++) {
            const currentThreshold = taxThresholds[i];
            const nextThreshold = taxThresholds[i + 1];
            
            if (taxableIncome > currentThreshold.threshold) {
                const taxableAmount = Math.min(
                    taxableIncome - currentThreshold.threshold,
                    nextThreshold.threshold - currentThreshold.threshold
                );
                incomeTax += taxableAmount * currentThreshold.rate;
            }
        }
        
        // Add tax for the highest bracket if applicable
        const highestThreshold = taxThresholds[taxThresholds.length - 1];
        if (taxableIncome > highestThreshold.threshold) {
            incomeTax += (taxableIncome - highestThreshold.threshold) * highestThreshold.rate;
        }
        
        // Calculate Medicare Levy
        const medicareLevy = taxableIncome * medicareLevyRate;
        
        // Calculate HELP/HECS repayment
        let hecsRepayment = 0;
        if (hasHecs) {
            for (let i = hecsRates.length - 1; i >= 0; i--) {
                if (taxableIncome > hecsRates[i].threshold) {
                    hecsRepayment = taxableIncome * hecsRates[i].rate;
                    break;
                }
            }
        }
        
        // Calculate total tax and take home pay
        const totalTax = incomeTax + medicareLevy + hecsRepayment;
        const takeHomePay = grossIncome - totalTax;
        
        // Update results
        document.getElementById('taxableIncome').textContent = formatCurrency(taxableIncome);
        document.getElementById('incomeTax').textContent = formatCurrency(incomeTax);
        document.getElementById('medicareLevy').textContent = formatCurrency(medicareLevy);
        document.getElementById('hecsRepayment').textContent = formatCurrency(hecsRepayment);
        document.getElementById('totalTax').textContent = formatCurrency(totalTax);
        document.getElementById('takeHomePay').textContent = formatCurrency(takeHomePay);
        
        // Show results with animation
        resultDiv.classList.add('active');
        
        // Scroll to results
        resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
    
    // Format currency
    function formatCurrency(amount) {
        return '$' + amount.toLocaleString('en-AU', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }
    
    // Add input validation and formatting
    const numberInputs = document.querySelectorAll('input[type="number"]');
    numberInputs.forEach(input => {
        input.addEventListener('input', function() {
            // Remove any non-numeric characters
            this.value = this.value.replace(/[^0-9.]/g, '');
            
            // Ensure only one decimal point
            const parts = this.value.split('.');
            if (parts.length > 2) {
                this.value = parts[0] + '.' + parts.slice(1).join('');
            }
        });
    });
}); 