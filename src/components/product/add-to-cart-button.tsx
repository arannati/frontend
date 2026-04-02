'use client'

import { useRouter } from 'next/navigation'

import { ShoppingCart } from 'lucide-react'

import { useAddToCart, useCart } from '@/api/hooks/cart/useCart'
import { QuantityControl } from '@/components/cart/quantity-control'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/routes'
import { useAuth } from '@/hooks/useAuth'

interface AddToCartButtonProps {
	productId: string
}

export function AddToCartButton({ productId }: AddToCartButtonProps) {
	const router = useRouter()
	const { isAuthenticated } = useAuth()
	const addToCart = useAddToCart()
	const { data: cart } = useCart()

	const inCart = cart?.items.some((i) => i.productId === productId) ?? false

	const handleClick = () => {
		if (!isAuthenticated) {
			router.push(ROUTES.AUTH.LOGIN)
			return
		}
		addToCart.mutate({ productId, quantity: 1 })
	}

	if (inCart) {
		return <QuantityControl productId={productId} size='md' className='w-full justify-center' />
	}

	return (
		<Button size='lg' className='w-full' onClick={handleClick} loading={addToCart.isPending}>
			<ShoppingCart className='mr-2 h-5 w-5' />В корзину
		</Button>
	)
}
