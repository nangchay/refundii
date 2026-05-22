import { createClient } from './client'

// Đăng ký tài khoản mới với email thật + password
export async function signUpWithEmail(
  walletName: string,
  email: string,
  password: string
) {
  const supabase = createClient()

  // Kiểm tra wallet_name đã tồn tại chưa
  const { data: existingWallet } = await supabase
    .from('profiles')
    .select('id')
    .eq('wallet_name', walletName)
    .maybeSingle()

  if (existingWallet) {
    return { error: 'Tên Ví đã tồn tại, vui lòng chọn tên khác' }
  }

  // Kiểm tra email đã tồn tại chưa
  const { data: existingEmail } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email.toLowerCase())
    .maybeSingle()

  if (existingEmail) {
    return { error: 'Email đã được sử dụng, vui lòng dùng email khác' }
  }

  // Đăng ký với Supabase Auth - sẽ gửi OTP về email
  const { data, error } = await supabase.auth.signUp({
    email: email.toLowerCase(),
    password,
    options: {
      data: {
        wallet_name: walletName,
      },
    },
  })

  if (error) {
    if (error.message.includes('already registered')) {
      return { error: 'Email đã được đăng ký' }
    }
    if (error.message.includes('rate limit') || error.status === 429) {
      return { error: 'Quá nhiều yêu cầu. Vui lòng đợi 60 giây rồi thử lại' }
    }
    return { error: error.message }
  }

  return { data, error: null }
}

// Xác thực OTP sau khi đăng ký
export async function verifySignUpOtp(email: string, token: string) {
  const supabase = createClient()

  // Thử với type 'email' trước (Supabase mặc định dùng type này cho confirmation)
  let result = await supabase.auth.verifyOtp({
    email: email.toLowerCase(),
    token,
    type: 'email',
  })

  // Nếu không được, thử với type 'signup'
  if (result.error) {
    result = await supabase.auth.verifyOtp({
      email: email.toLowerCase(),
      token,
      type: 'signup',
    })
  }

  if (result.error) {
    console.error('OTP verify error:', result.error)
    return { error: 'Mã xác thực không chính xác. Vui lòng thử lại' }
  }

  const { data } = result

  // Sau khi verify thành công, tạo profile
  if (data.user) {
    const walletName = data.user.user_metadata?.wallet_name

    if (walletName) {
      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        wallet_name: walletName,
        email: email.toLowerCase(),
      })

      if (profileError && !profileError.message.includes('duplicate')) {
        console.error('Profile creation error:', profileError)
      }
    }
  }

  return { data, error: null }
}

// Gửi lại OTP
export async function resendOtp(email: string) {
  const supabase = createClient()

  const { error } = await supabase.auth.resend({
    type: 'signup',
    email: email.toLowerCase(),
  })

  if (error) {
    if (error.message.includes('rate limit') || error.status === 429) {
      return { error: 'Quá nhiều yêu cầu. Vui lòng đợi 60 giây rồi thử lại' }
    }
    return { error: error.message }
  }

  return { error: null }
}

// Đăng nhập đa phương thức: Email hoặc Tên Ví + Password
export async function signInWithCredentials(
  identifier: string, // có thể là email hoặc wallet_name
  password: string
) {
  const supabase = createClient()

  let email = identifier.toLowerCase()

  // Nếu không có @ thì đây là wallet_name, cần tìm email tương ứng
  if (!identifier.includes('@')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('email')
      .eq('wallet_name', identifier)
      .maybeSingle()

    if (!profile || !profile.email) {
      return { error: 'Tên Ví không tồn tại' }
    }

    email = profile.email
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    if (error.message.includes('Invalid login credentials')) {
      return { error: 'Thông tin đăng nhập không chính xác' }
    }
    if (error.message.includes('Email not confirmed')) {
      return { error: 'Email chưa được xác thực. Vui lòng kiểm tra hộp thư' }
    }
    return { error: error.message }
  }

  return { data, error: null }
}

// Quên mật khẩu - gửi link reset về email
export async function sendPasswordReset(identifier: string) {
  const supabase = createClient()

  let email = identifier.toLowerCase()

  // Nếu không có @ thì đây là wallet_name, cần tìm email tương ứng
  if (!identifier.includes('@')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('email')
      .eq('wallet_name', identifier)
      .maybeSingle()

    if (!profile || !profile.email) {
      return { error: 'Tên Ví không tồn tại trong hệ thống' }
    }

    email = profile.email
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  })

  if (error) {
    if (error.message.includes('rate limit') || error.status === 429) {
      return { error: 'Quá nhiều yêu cầu. Vui lòng đợi vài phút rồi thử lại' }
    }
    return { error: error.message }
  }

  return { error: null }
}

// Đặt lại mật khẩu mới
export async function updatePassword(newPassword: string) {
  const supabase = createClient()

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  })

  if (error) {
    return { error: error.message }
  }

  return { error: null }
}

// Đăng xuất
export async function logout() {
  const supabase = createClient()
  await supabase.auth.signOut()
}

// Lấy thông tin user hiện tại
export async function getCurrentUser() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return profile
}
