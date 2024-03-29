import { makeAutoObservable } from 'mobx'
import { initialProducts } from './initialProducts'
import { IProduct } from './types/IProduct'
import { round } from './utils'

export function calcCartTotal(cartProducts: IProduct[]) {
  const subtotal = cartProducts.reduce((acc, product) => {
    return acc + product.price * product.quantity
  }, 0)
  const tax = subtotal * 0.13
  const total = subtotal + tax

  return {
    subtotal: round(subtotal),
    tax: round(tax),
    total: round(total),
  }
}

type OrderStatus = 'success' | 'error' | 'pending' | undefined

export const orderStore = makeAutoObservable({
  status: undefined as OrderStatus,
  reset() {
    orderStore.status = undefined
  },
  *createOrder() {
    orderStore.status = 'pending'
    const { success } = yield fetch(
      'https://mocki.io/v1/909c7add-6fdf-4ee0-ac14-16147d1f3a0f' // запрос должен вернуть {success: true}
    ).then((res) => res.json())

    if (success) {
      orderStore.status = 'success'
      productsStore.products.forEach((p) => (p.quantity = 0))
    } else {
      orderStore.status = 'error'
    }
  },
})

export const productsStore = makeAutoObservable({
  products: initialProducts,
  headerClicks: 0,
  increaseHeaderClicks() {
    productsStore.headerClicks++
  },
  increaseQuantity(id: IProduct['id']) {
    const product = productsStore.products.find((p) => p.id === id)
    if (product) {
      product.quantity++
    }
  },
  decreaseQuantity(id: IProduct['id']) {
    const product = productsStore.products.find((p) => p.id === id)
    if (product && product.quantity > 0) {
      product.quantity--
    }
  },
  get total() {
    return calcCartTotal(this.products)
  },
})
