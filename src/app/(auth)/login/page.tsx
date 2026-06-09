'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useLogin } from '@/features/shared/auth.services/auth.query'

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'البريد الإلكتروني مطلوب')
    .email('البريد الإلكتروني غير صحيح'),
  password: z
    .string()
    .min(1, 'كلمة المرور مطلوبة')
    .min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const { mutate: submitLogin, isPending } = useLogin()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = (values: LoginFormValues) => {
    submitLogin(
      { username: values.email, password: values.password, rememberMe: false },
      {
        onError: () => {
          setError('root', { message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.' })
        },
      },
    )
  }

  return (
    <div className="w-full max-w-md md:self-center">
      <div className="space-y-2">
        <p className="text-xs font-medium tracking-wide text-primary">مرحبًا بك</p>
        <h2 className="text-2xl font-semibold text-foreground">تسجيل الدخول</h2>
        <p className="text-sm text-muted-foreground">
          أدخل بريدك الإلكتروني وكلمة المرور للوصول إلى لوحة التحكم.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email">البريد الإلكتروني</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="name@example.com"
            className="h-11 rounded-xl bg-background/85"
            {...register('email')}
          />
          {errors.email ? (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">كلمة المرور</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            className="h-11 rounded-xl bg-background/85"
            {...register('password')}
          />
          {errors.password ? (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          ) : null}
        </div>

       

        <Button
          type="submit"
          disabled={isPending}
          className="h-11 w-full rounded-xl text-sm font-semibold"
        >
          {isPending ? 'جارٍ تسجيل الدخول...' : 'تسجيل الدخول'}
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          لا تملك حساب منظمة؟{' '}
          <Link href="/register" className="font-semibold text-primary hover:underline">
            إنشاء حساب جديد
          </Link>
        </p>
      </form>
    </div>
  )
}
