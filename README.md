# Genshin Bot

>使用Typescript编写的原神QQ机器人

**这个项目目前正在扩展，加入更多原神相关娱乐和信息查询功能，敬请期待**

## 简介

原神QQ机器人，包含圣遗物评分以及抽卡分析等功能

## 安装
1. 安装[Mirai](https://github.com/mamoe/mirai)
   > Mirai仓库中有详细的安装方式
   
2. 安装NodeJS


3. 使用以下命令拉取本项目：

   ```shell
   git clone https://github.com/MemoryDewey/genshin-bot.git
   ```

4. 编辑目录下的.env文件，根据自己的Mirai配置修改对应的配置

5. 启动
   ```shell
   npm run start
   ```

## 命令列表

群内使用`原神帮助`进行查看

### 圣遗物评分
指令|说明
:--|:--
@bot 圣遗物评分 圣遗物图片截图|圣遗物评分，上传的圣遗物图片可参考[可莉特调](https://genshin.pub)
@bot 修改 主 xxx|修改圣遗物主词条属性
@bot 修改 副x xxx|修改圣遗物副词条属性
<br>
**例：**
<br>
[圣遗物评分](https://github.com/MemoryDewey/genshin-bot/blob/master/doc/rate.png)
<br>
> **注:**  @bot需手动at机器人账号；若设置了bot别名，也可使用bot别名 xxxx来替代 @bot

### 抽卡分析
指令|说明
:--|:--  
导入抽卡链接 https://xxxxx/log|需要私聊机器人，添加抽卡链接
抽卡分析 [武器/角色/新手/常驻]|分析抽卡的卡池
<br>
**例：**
<br>
[导入抽卡链接](https://github.com/MemoryDewey/genshin-bot/blob/master/doc/add-href.png)
<br>
[抽卡分析](https://github.com/MemoryDewey/genshin-bot/blob/master/doc/wish-anylasis.png)
<br>
> **注:**  抽卡的链接需要断网获取，详细获取抽卡链接的教程请参考微信公众号派蒙工具箱


### 黄历/抽签
指令|说明
:--|:--  
黄历|查看今天的黄历  
抽签|抽取今日的签
解签|获得所抽签文的解答


### 丘丘语

指令|说明
:--|:--  
丘丘一下 [丘丘语句]|翻译丘丘语,注意这个翻译只能把丘丘语翻译成中文，不能反向  
丘丘词典 [丘丘语句]|查询丘丘语句的单词含义

**例：**`丘丘一下 mita`


## 致谢
**[mirai-ts](https://github.com/YunYouJun/mirai-ts)**

**[可莉特调](https://genshin.pub)**

**[Genshin_Impact_bot](https://github.com/H-K-Y/Genshin_Impact_bot)**

## 更新记录

### 2021-6-22
* 加入圣遗物评分功能
* 加入抽签黄历功能
* 加入丘丘语翻译功能
* 加入抽卡分析功能

