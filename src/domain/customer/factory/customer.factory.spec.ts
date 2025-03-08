import CustomerFactory from "./customer.factory";
import Address from "../value-object/address";
import EventDispatcher from "../../@shared/event/event-dispatcher";
import CustomerCreatedEvent from "../event/customer-created.event";
import EnviaConsoleLog1Handler from "../event/handler/envia-console-log-1.handler";
import EnviaConsoleLog2Handler from "../event/handler/envia-console-log-2.handler";

describe("Customer factory unit test", () => {

  it("should create a customer", () => {

    const registerSpy = jest.spyOn(EventDispatcher.prototype, "register");
    const notifySpy = jest.spyOn(EventDispatcher.prototype, "notify");

    let customer = CustomerFactory.create("John");

    expect(customer.id).toBeDefined();
    expect(customer.name).toBe("John");
    expect(customer.Address).toBeUndefined();

    expect(registerSpy).toHaveBeenCalledWith("CustomerCreatedEvent", expect.any(EnviaConsoleLog1Handler));
    expect(notifySpy).toHaveBeenCalledWith(expect.any(CustomerCreatedEvent));

    registerSpy.mockRestore();
    notifySpy.mockRestore();
  });

  it("should create a customer with an address", () => {
    const registerSpy = jest.spyOn(EventDispatcher.prototype, "register");
    const notifySpy = jest.spyOn(EventDispatcher.prototype, "notify");

    const address = new Address("Street", 1, "13330-250", "São Paulo");

    let customer = CustomerFactory.createWithAddress("John", address);

    expect(customer.id).toBeDefined();
    expect(customer.name).toBe("John");
    expect(customer.Address).toBe(address);

    expect(registerSpy).toHaveBeenCalledWith("CustomerCreatedEvent", expect.any(EnviaConsoleLog2Handler));
    expect(notifySpy).toHaveBeenCalledWith(expect.any(CustomerCreatedEvent));

    registerSpy.mockRestore();
    notifySpy.mockRestore();
  });
});
