import EventEmitter2 from 'eventemitter2';
import { AggregateRoot } from '../aggregate-root';

export class DomainEventMediator {
  constructor(private eventEmmiter: EventEmitter2) {}

  register(event: string, handler: (event: any) => void) {
    this.eventEmmiter.on(event, handler);
  }

  async publish(aggregateRoot: AggregateRoot) {
    for (const event of aggregateRoot.getUncommittedEvents()) {
      aggregateRoot.markEventAsDispatched(event);
      await this.eventEmmiter.emitAsync(event.constructor.name, event);
    }
  }

  async publishIntegrationEvents(aggreateRoot: AggregateRoot) {
    for (const event of aggreateRoot.events) {
      const integrationEvent = event.getIntegrationEvent?.();
      if (!integrationEvent) continue;
      await this.eventEmmiter.emitAsync(
        integrationEvent.event_name,
        integrationEvent,
      );
    }
  }
}
