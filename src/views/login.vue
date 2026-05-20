<template>
  <div class="carbon-login">
    <div class="login-banner">
      <div class="banner-overlay" />
      <div class="banner-content">
        <p class="banner-tag">梵净山 · 江口</p>
        <h1 class="banner-title">世界自然遗产 · 国家级自然保护区 · 地球绿洲</h1>
        <p class="banner-sub">森林覆盖率 77.3% · 碳汇资源丰富 · 生态文明先行区</p>
      </div>
    </div>
    <div class="login-panel">
      <div class="login-form-wrap">
        <h2 class="form-title">江口县碳汇开发管理平台</h2>
        <p class="form-subtitle">Carbon Sink Development Management</p>
        <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" placeholder="账号" prefix-icon="el-icon-user" />
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="loginForm.password" type="password" placeholder="密码" prefix-icon="el-icon-lock" @keyup.enter.native="handleLogin" />
          </el-form-item>
          <el-form-item prop="code" v-if="captchaEnabled">
            <el-input v-model="loginForm.code" placeholder="验证码" style="width: 63%" @keyup.enter.native="handleLogin" />
            <div class="login-code">
              <img :src="codeUrl" class="login-code-img" @click="getCode" />
            </div>
          </el-form-item>
          <el-button type="primary" class="login-btn" :loading="loading" @click.native.prevent="handleLogin">登 录</el-button>
        </el-form>
        <p class="demo-tip">演示账号：admin / admin123</p>
      </div>
    </div>
  </div>
</template>

<script>
import { getCodeImg } from '@/api/login'
import Cookies from 'js-cookie'
import { encrypt, decrypt } from '@/utils/jsencrypt'

export default {
  name: 'Login',
  data() {
    return {
      codeUrl: '',
      loginForm: {
        username: 'admin',
        password: 'admin123',
        code: '',
        uuid: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', message: '请输入账号' }],
        password: [{ required: true, trigger: 'blur', message: '请输入密码' }],
        code: [{ required: true, trigger: 'change', message: '请输入验证码' }]
      },
      loading: false,
      captchaEnabled: true,
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    },
    captchaEnabled(val) {
      if (!val) {
        this.loginRules.code = []
      }
    }
  },
  created() {
    this.getCode()
    this.getCookie()
  },
  methods: {
    getCode() {
      getCodeImg().then(res => {
        this.captchaEnabled = res.captchaEnabled === undefined ? true : res.captchaEnabled
        if (this.captchaEnabled) {
          this.codeUrl = 'data:image/gif;base64,' + res.img
          this.loginForm.uuid = res.uuid
        } else {
          this.loginRules.code = []
        }
      })
    },
    getCookie() {
      const username = Cookies.get('username')
      const password = Cookies.get('password')
      if (username) {
        this.loginForm.username = username
        this.loginForm.password = decrypt(password)
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (!valid) return
        this.loading = true
        this.$store.dispatch('Login', this.loginForm).then(() => {
          this.$router.push({ path: this.redirect || '/carbon/ledger' }).catch(() => {})
        }).catch(() => {
          this.loading = false
          if (this.captchaEnabled) this.getCode()
        })
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.carbon-login {
  display: flex;
  min-height: 100vh;
}
.login-banner {
  flex: 1;
  position: relative;
  background: url('../assets/images/login-background.jpg') center/cover no-repeat;
  display: flex;
  align-items: flex-end;
  padding: 48px;
}
.banner-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(15, 92, 54, 0.75), rgba(26, 127, 75, 0.45));
}
.banner-content {
  position: relative;
  z-index: 1;
  color: #fff;
  max-width: 520px;
}
.banner-tag {
  font-size: 14px;
  letter-spacing: 4px;
  opacity: 0.9;
  margin-bottom: 16px;
}
.banner-title {
  font-size: 22px;
  font-weight: 600;
  line-height: 1.6;
  margin: 0 0 12px;
}
.banner-sub {
  font-size: 14px;
  opacity: 0.85;
  margin: 0;
}
.login-panel {
  width: 480px;
  min-width: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  padding: 40px;
}
.form-title {
  margin: 0 0 8px;
  font-size: 22px;
  color: #1a2e24;
  text-align: center;
}
.form-subtitle {
  margin: 0 0 32px;
  font-size: 13px;
  color: #8a9a92;
  text-align: center;
}
.login-form ::v-deep .el-input input {
  height: 44px;
}
.login-btn {
  width: 100%;
  height: 44px;
  margin-top: 8px;
  background: #1a7f4b;
  border-color: #1a7f4b;
  font-size: 16px;
}
.login-btn:hover,
.login-btn:focus {
  background: #2d9c5a;
  border-color: #2d9c5a;
}
.login-code {
  width: 33%;
  float: right;
  height: 44px;
  img {
    height: 44px;
    cursor: pointer;
  }
}
.demo-tip {
  margin-top: 24px;
  text-align: center;
  font-size: 13px;
  color: #8a9a92;
}
</style>
