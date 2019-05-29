/**
 * Created by OXOYO on 2019/5/29.
 *
 * 多语言
 */
import VueI18n from 'vue-i18n'
import langs from './langs'

export default function (Vue, defLang) {
  let { config, Cookies } = Vue.prototype.$X
  let key = config.cookie.getItem('locale')
  let val = Cookies.get(key)
  if (!defLang) {
    let keys = Object.keys(langs.label)
    defLang = val || keys[0]
  }
  // 注册插件
  Vue.use(VueI18n)
  Vue.locale = () => {}
  // 全局挂载语言包key
  Vue.prototype.$X.langs = langs
  Vue.prototype.$X.locale = defLang
  // i18n实例
  return new VueI18n({
    locale: defLang,
    messages: langs.data
  })
}
