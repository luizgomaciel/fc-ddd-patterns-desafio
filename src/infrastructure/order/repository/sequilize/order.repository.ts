import Order from "../../../../domain/checkout/entity/order";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
import OrderRepositoryInterface from "../../../../domain/checkout/repository/order-repository.interface";
import OrderItem from "../../../../domain/checkout/entity/order_item";

export default class OrderRepository implements OrderRepositoryInterface {
  async update(entity: Order): Promise<void> {
    await OrderModel.update(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        where: {
          id: entity.id,
        },
      },
    );

    const existingItems = await OrderItemModel.findAll({
      where: { order_id: entity.id },
    });

    const newItemsMap = new Map(entity.items.map((item) => [item.id, item]));

    for (const existingItem of existingItems) {
      if (!newItemsMap.has(existingItem.id)) {
        await OrderItemModel.destroy({ where: { id: existingItem.id } });
      }
    }

    for (const item of entity.items) {
      const existingItem = existingItems.find((i) => i.id === item.id);
      if (existingItem) {
        await OrderItemModel.update(
          {
            name: item.name,
            price: item.price,
            product_id: item.productId,
            quantity: item.quantity,
          },
          { where: { id: item.id } }
        );
      } else {
        await OrderItemModel.create({
          id: item.id,
          order_id: entity.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        });
      }
    }
  }

  async find(id: string): Promise<Order> {
    let orderModel;
    try {
      orderModel = await OrderModel.findOne({
        where: { id },
        include: [{ model: OrderItemModel, as: "items" }],
        rejectOnEmpty: true,
      });
    } catch (error) {
      throw new Error("Customer not found");
    }

    const orderItem = orderModel.items.map((item) => new OrderItem(
      item.id,
      item.name,
      item.price,
      item.product_id,
      item.quantity,
    ));

    return new Order(id, orderModel.customer_id, orderItem);
  }

  async findAll(): Promise<Order[]> {
    const orderModels = await OrderModel.findAll({
      include: [{ model: OrderItemModel, as: "items" }],
    });

    const orders = orderModels.map((model) => {
      const orderItem = model.items.map((item) => new OrderItem(
        item.id,
        item.name,
        item.price,
        item.product_id,
        item.quantity,
    ));

     return new Order(model.id, model.customer_id, orderItem);

    });

    return orders;
  }

  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }
}
