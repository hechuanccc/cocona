<template>
  <div class="container">
    <div class="promo-title">
      <h1 class="title">遊戲介紹</h1>
      <span>GAME INTRO</span>
    </div>
    <el-tabs type="border-card" :tab-position="tabposition" class="mb-20 container">
      <el-tab-pane v-for="game in games" :key="game.id" :label="game.display_name">
        <div class="rules-content">
          <h1>重要声明</h1>
          <ul>
            <li>1.如果客户怀疑自己的资料被盗用，应立即通知本公司，并更改详细数据，以前的使用者名称及密码将全部无效。</li>
            <li>2.客户有责任确保自己的账户及登入资料的保密性。以使用者名称及密码进行的任何网上投注将被视为有效。</li>
            <li>3.公布赔率时出现的任何打字错误或非故意人为失误，本公司保留改正错误和按正确赔率结算投注的权力。您居住所在地的法律有可能规定网络博弈不合法；若此情况属实，本公司将不会批准您使用付账卡进行交易。</li>
            <li>4.每次登入时客户都应该核对自己的账户结余额。如对余额有任何疑问，请在第一时间内通知本公司。</li>
            <li>5.一旦投注被接受，则不得取消或修改。</li>
            <li>6.所有号码赔率将不时浮动，派彩时的赔率将以确认投注时之赔率为准。</li>
            <li>7.每注最高投注金额按不同[场次]及[投注项目]及[会员账号]设定浮动。如投注金额超过上述设定，本公司有权取消超过之投注金额。</li>
            <li>8.所有投注都必须在开奖前时间内进行否则投注无效。</li>
            <li>9.所有投注派彩彩金皆含本金。</li>
          </ul>
          <component :is="game.code"></component>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>


<style lang="sass" scoped>
$primary-color: #409EFF

.rules-content
  ul
    margin-bottom: 20px
  li
    font-size: 16px
    line-height: 24px
  h1
    font-size: 18px
    margin-bottom: 10px

.promo-title
  margin-bottom: 20px
  span
    color: #DDD
    font-size: 28px
    font-style: italic
    letter-spacing: 1px
  .title
    display: inline-block
    font-size: 32px
    line-height: 40px
    background: $primary-color
    color: #FFF
    margin: 10px 0 0 -20px
    padding: 10px 30px
    position: relative
    font-weight: 500
  .title:before
    bottom: -20px
    left: 0
    content: " "
    width: 0
    height: 0
    border-style: solid
    border-width: 0 20px 20px 0
    border-color: rgba(0, 0, 0, 0) darken($primary-color, 20%) rgba(0, 0, 0, 0) rgba(0, 0, 0, 0)
    position: absolute
    z-index: 0

.mb-20
  margin-bottom: 20px

</style>
<script>
import { fetchGames } from '../../api'
import cqlf from './AllGameRules/cqlf'
import gd11x5 from './AllGameRules/gd11x5'
import jsk3 from './AllGameRules/jsk3'
import mlaft from './AllGameRules/mlaft'
import gdklsf from './AllGameRules/gdklsf'
import bcr from './AllGameRules/bcr'
import jsssc from './AllGameRules/jsssc'
import jspk10 from './AllGameRules/jspk10'
import cqssc from './AllGameRules/cqssc'
import pcdd from './AllGameRules/pcdd'
import hkl from './AllGameRules/hkl'
import xjssc from './AllGameRules/xjssc'

export default {
  data () {
    return {
      tabposition: 'left',
      games: '',
      now_game: '132'
    }
  },
  created () {
    fetchGames().then(
      games => {
        this.games = games
      }
    )
  },
  components: {
    cqlf,
    gd11x5,
    jsk3,
    mlaft,
    gdklsf,
    bcr,
    jsssc,
    jspk10,
    cqssc,
    pcdd,
    hkl,
    xjssc
  }
}
</script>
