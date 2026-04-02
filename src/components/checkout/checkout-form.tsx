'use client'

import { useRouter } from 'next/navigation'

import { useForm } from '@tanstack/react-form'
import { z } from 'zod/v4'

import { useCreateOrder } from '@/api/hooks/orders/useOrders'
import { useMe } from '@/api/hooks/user/useUser'
import { createPayment } from '@/api/requests/payments'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ROUTES } from '@/constants/routes'
import { translateError } from '@/lib/utils/error-map'

const schema = z.object({
	shippingAddress: z.string().min(5, 'Введите полный адрес доставки'),
	phone: z.string().min(6, 'Введите корректный номер телефона'),
})

export function CheckoutForm() {
	const router = useRouter()
	const createOrder = useCreateOrder()
	const { data: user } = useMe()

	const form = useForm({
		defaultValues: {
			shippingAddress: '',
			phone: user?.phone ?? '',
		},
		onSubmit: async ({ value }) => {
			const fullAddress = `Адрес: ${value.shippingAddress}\nТелефон: ${value.phone}`
			const order = await createOrder.mutateAsync({
				shippingAddress: fullAddress,
			})

			try {
				const payment = await createPayment({
					orderId: order.id,
					amount: order.totalAmount,
					currency: order.currency,
				})

				// Когда Paybox пришлёт документацию и интеграция заработает —
				// здесь будет реальный редирект на виджет оплаты
				if (payment.paymentUrl) {
					window.location.href = payment.paymentUrl
					return
				}
			} catch {
				// Платёжный провайдер ещё не настроен — показываем мок-страницу оплаты
			}

			router.push(
				`${ROUTES.CHECKOUT.PAYMENT}?orderId=${order.id}&amount=${order.totalAmount}&currency=${order.currency}`,
			)
		},
	})

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault()
				form.handleSubmit()
			}}
			className='flex flex-col gap-5'
		>
			<form.Field name='phone' validators={{ onSubmit: schema.shape.phone }}>
				{(field) => (
					<Input
						label='Номер телефона'
						placeholder='+996 555 123456'
						type='tel'
						value={field.state.value}
						onChange={(e) => field.handleChange(e.target.value)}
						error={field.state.meta.errors[0]?.message}
					/>
				)}
			</form.Field>

			<form.Field name='shippingAddress' validators={{ onSubmit: schema.shape.shippingAddress }}>
				{(field) => (
					<Input
						label='Адрес доставки'
						placeholder='г. Бишкек, ул. Манаса 42, кв. 5'
						value={field.state.value}
						onChange={(e) => field.handleChange(e.target.value)}
						error={field.state.meta.errors[0]?.message}
					/>
				)}
			</form.Field>

			{createOrder.error && (
				<p className='text-sm text-red-500'>
					{translateError((createOrder.error as any)?.response?.data?.message)}
				</p>
			)}

			<Button type='submit' size='lg' className='w-full' loading={createOrder.isPending}>
				Перейти к оплате
			</Button>
		</form>
	)
}
