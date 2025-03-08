import Customer from "../entity/customer";
import { v4 as uuid } from "uuid";
import Address from "../value-object/address";
import EnviaConsoleLog1Handler from "../event/handler/envia-console-log-1.handler"
import EventDispatcher from "../../@shared/event/event-dispatcher";
import CustomerCreatedEvent from "../event/customer-created.event";

export default class CustomerFactory {
  public static create(name: string): Customer {
    const customer = new Customer(uuid(), name);
    const eventDispatcher = new EventDispatcher();

    const customerCreatedEvent = new CustomerCreatedEvent({
      id: customer.id,
      nome: customer.name,
    });

    const eventHandler = new EnviaConsoleLog1Handler();

    eventDispatcher.register("CustomerCreatedEvent", eventHandler);
    eventDispatcher.notify(customerCreatedEvent);

    return customer;
  }

  public static createWithAddress(name: string, address: Address): Customer {
    const customer = new Customer(uuid(), name);
    customer.changeAddress(address);
    return customer;
  }
}
