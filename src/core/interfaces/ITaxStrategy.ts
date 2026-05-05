export interface ITaxStrategy {
    calculateTax(amount: number, category: string): number;
}

export class ICMSBrasilStrategy implements ITaxStrategy {
    calculateTax(amount: number, category: string): number {
        return category === 'essential' ? amount * 0.07 : amount * 0.18;
    }
}

export class VATEuropeStrategy implements ITaxStrategy {
    calculateTax(amount: number, category: string): number {
        return category === 'food' ? 0.0 : amount * 0.20; 
    }
}

export class TaxStrategyFactory {
    static getStrategy(countryCode: string): ITaxStrategy {
        switch (countryCode) {
            case 'BR': return new ICMSBrasilStrategy();
            case 'PT':
            case 'GB': return new VATEuropeStrategy();
            default: throw new Error("Região não suportada para o Motor de Impostos.");
        }
    }
}
