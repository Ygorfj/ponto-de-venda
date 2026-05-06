import { Command } from '../../core/interfaces/IModels';
import { ICommandRepository } from '../../core/interfaces/IRepositories';

export class ManageCommandsUseCase {
    constructor(private commandRepository: ICommandRepository) {}

    async openCommand(tenantId: string, commandNumber: string): Promise<Command> {
        if (!commandNumber) {
            throw new Error('Command number is required');
        }

        return this.commandRepository.create({
            tenant_id: tenantId,
            command_number: commandNumber,
            status: 'open'
        });
    }

    async getOpenCommands(tenantId: string): Promise<Command[]> {
        return this.commandRepository.findByTenantAndStatus(tenantId, 'open');
    }

    async closeCommand(commandId: string): Promise<Command> {
        return this.commandRepository.closeCommand(commandId);
    }
}
