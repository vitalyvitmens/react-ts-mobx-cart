import { productsStore } from '../store'

export function Header() {
  return (
    <div className="header" onClick={productsStore.increaseHeaderClicks}>
      <h1>Your cart</h1>
      <p>"I say let the world go to hell, but I should always have my tea."</p>
      <p>― Fyodor Dostoyevsky, Notes from Underground</p>
    </div>
  )
}
