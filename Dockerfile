FROM node:16-alpine

# 设置时区
ENV TZ=Asia/Shanghai \
    DEBIAN_FRONTEND=noninteractive

# 创建工作目录
RUN mkdir -p /app

# 指定工作目录
WORKDIR /app

# 复制当前代码到/app工作目录
COPY . ./

# npm 源，选用国内镜像源以提高下载速度
RUN npm config set registry https://registry.npm.taobao.org/

# RUN npm install -g npm@9.4.0
# npm 安装依赖
RUN npm install
# RUN npm ci
# 打包
RUN npm run build

# 使用打包后的镜像
CMD npm run start:prod

EXPOSE 18080