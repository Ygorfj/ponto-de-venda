import { Payment, CashFlowEntry } from '../../core/interfaces/IModels';
import { IPaymentMethodRepository, ICashFlowRepository, IPaymentRepository } from '../../core/interfaces/IRepositories';

export class ProcessPaymentAndCashFlowUseCase {
    constructor(
        private cashFlowRepository: ICashFlowRepository,
        private paymentMethodRepository: IPaymentMethodRepository,
        private paymentRepository: IPaymentRepository
    ) {}

    async processSalePayment(
        tenantId: string,
        saleId: string,
        paymentMethodId: string,
        grossAmount: number,
        description: string,
        feeOverride?: number
    ): Promise<{ payment: Payment, cashFlowEntry: CashFlowEntry }> {
        // 1. Fetch the Payment Method to get fee and days to receive
        const method = await this.paymentMethodRepository.findById(paymentMethodId);
        
        if (!method || method.tenant_id !== tenantId) {
            throw new Error('Payment method not found or unauthorized');
        }
        if (!method.active) {
            throw new Error('Payment method is inactive');
        }

        // 2. Register the gross payment for the sale
        const payment = await this.paymentRepository.create({
            tenant_id: tenantId,
            sale_id: saleId,
            payment_method_id: paymentMethodId,
            amount: grossAmount,
            status: 'completed'
        });

        // 3. Calculate Net Amount and Due Date for the POS Barramento
        // Use override if provided, otherwise use the default method fee
        const effectiveFee = feeOverride !== undefined ? feeOverride : method.fee_percentage;
        const feeMultiplier = (100 - effectiveFee) / 100;
        const netAmount = grossAmount * feeMultiplier;
        
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + method.days_to_receive);

        // 4. Create entry in Cash Flow waiting for the machine to pay out
        const isImmediate = method.days_to_receive === 0;
        const cashFlowEntry = await this.cashFlowRepository.create({
            tenant_id: tenantId,
            type: 'receivable',
            description: `Venda ${method.name} - ${description}`,
            amount: netAmount,
            due_date: dueDate,
            status: isImmediate ? 'paid' : 'pending',
            payment_id: payment.id
        });

        return { payment, cashFlowEntry };
    }

    async registerPayable(
        tenantId: string,
        description: string,
        amount: number,
        dueDate: Date
    ): Promise<CashFlowEntry> {
        return this.cashFlowRepository.create({
            tenant_id: tenantId,
            type: 'payable',
            description,
            amount,
            due_date: dueDate,
            status: 'pending'
        });
    }
}
