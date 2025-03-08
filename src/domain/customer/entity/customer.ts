import Address from "../value-object/address";
import CustomerCreatedEvent from "../event/customer-created.event";
import EventDispatcher from "../../@shared/event/event-dispatcher";
import EnviaConsoleLog2Handler from "../event/handler/envia-console-log-2.handler";

export default class Customer {
  private _id: string;
  private _name: string = "";
  private _address!: Address;
  private _active: boolean = false;
  private _rewardPoints: number = 0;

  constructor(id: string, name: string) {
    this._id = id;
    this._name = name;
    this.validate();
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get rewardPoints(): number {
    return this._rewardPoints;
  }

  validate() {
    if (this._id.length === 0) {
      throw new Error("Id is required");
    }
    if (this._name.length === 0) {
      throw new Error("Name is required");
    }
  }

  changeName(name: string) {
    this._name = name;
    this.validate();
  }

  get Address(): Address {
    return this._address;
  }
  
  changeAddress(address: Address) {
    this._address = address;

    const eventDispatcher = new EventDispatcher();

    const customerCreatedEvent = new CustomerCreatedEvent({
      id: this.id,
      nome: this.name,
      endereco: `${this.Address.street}, ${this.Address.number} - ${this.Address._city} - ${this.Address.zip} `
    });

    const eventHandler = new EnviaConsoleLog2Handler();

    eventDispatcher.register("CustomerCreatedEvent", eventHandler);
    eventDispatcher.notify(customerCreatedEvent);
  }

  isActive(): boolean {
    return this._active;
  }

  activate() {
    if (this._address === undefined) {
      throw new Error("Address is mandatory to activate a customer");
    }
    this._active = true;
  }

  deactivate() {
    this._active = false;
  }

  addRewardPoints(points: number) {
    this._rewardPoints += points;
  }

  set Address(address: Address) {
    this._address = address;
  }
}
