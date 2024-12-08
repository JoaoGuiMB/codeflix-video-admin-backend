import { DomainEventMediator } from '@core/shared/domain/events/domain-event-mediator';
import { IUnitOfWork } from '@core/shared/domain/repository/unit-of-work.interface';
import { ApplicationService } from '../application.service';
import { UnitOfWorkFakeInMemory } from '@core/shared/infra/db/in-memory/fake-unit-of-work-in-memory';
import EventEmitter2 from 'eventemitter2';
import { AggregateRoot } from '@core/shared/domain/aggregate-root';
import { ValueObject } from '@core/shared/domain/value-object';

class StubAggregateRoot extends AggregateRoot {
  get entity_id(): ValueObject {
    throw new Error('Method not implemented.');
  }
  toJSON() {
    throw new Error('Method not implemented.');
  }
}
describe('ApplicationService Unit Tests', () => {
  let uow: IUnitOfWork;
  let domainEventMediator: DomainEventMediator;
  let applicationService: ApplicationService;

  beforeEach(() => {
    uow = new UnitOfWorkFakeInMemory();
    const eventEmitter = new EventEmitter2();
    domainEventMediator = new DomainEventMediator(eventEmitter);
    applicationService = new ApplicationService(uow, domainEventMediator);
  });

  describe('start', () => {
    it('should start the unit of work', async () => {
      const startSpy = jest.spyOn(uow, 'start');
      await applicationService.start();
      expect(startSpy).toHaveBeenCalled();
    });
  });

  describe('fail', () => {
    it('should rollback the unit of work', async () => {
      const rollbackSpy = jest.spyOn(uow, 'rollback');
      await applicationService.fail();
      expect(rollbackSpy).toHaveBeenCalled();
    });
  });

  describe('finish', () => {
    it('should commit the unit of work', async () => {
      const commitSpy = jest.spyOn(uow, 'commit');
      await applicationService.finish();
      expect(commitSpy).toHaveBeenCalled();
    });

    it('should call the publish method of domain event mediator and the commit method', async () => {
      const aggregateRoot = new StubAggregateRoot();
      uow.addAggregateRoot(aggregateRoot);
      const publishSpy = jest.spyOn(domainEventMediator, 'publish');
      const publishIntegrationEventsSpy = jest.spyOn(
        domainEventMediator,
        'publishIntegrationEvents',
      );
      const commitSpy = jest.spyOn(uow, 'commit');
      await applicationService.finish();
      expect(publishSpy).toHaveBeenCalledWith(aggregateRoot);
      expect(commitSpy).toHaveBeenCalled();
      expect(publishIntegrationEventsSpy).toHaveBeenCalledWith(aggregateRoot);
    });
  });

  describe('run', () => {
    it('should start and finish the application service', async () => {
      const startSpy = jest.spyOn(applicationService, 'start');
      const finishSpy = jest.spyOn(applicationService, 'finish');
      const callback = jest.fn().mockResolvedValue('result');
      await applicationService.run(callback);

      expect(startSpy).toHaveBeenCalled();
      expect(finishSpy).toHaveBeenCalled();
      expect(callback).toHaveBeenCalled();
    });
    it('should rollback and throw the error if the callback throws an error', async () => {
      const callback = jest.fn().mockRejectedValue(new Error('test-error'));
      const spyFail = jest.spyOn(applicationService, 'fail');
      await expect(applicationService.run(callback)).rejects.toThrowError(
        'test-error',
      );
      expect(spyFail).toBeCalled();
    });
  });
});
