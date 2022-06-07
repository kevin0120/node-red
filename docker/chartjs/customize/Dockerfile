FROM nodered/node-red

# RUN sed -i 's/archive.ubuntu.com/mirrors.ustc.edu.cn/g' /etc/apt/sources.list
# RUN sed -i 's/security.ubuntu.com/mirrors.ustc.edu.cn/g' /etc/apt/sources.list

#RUN npm install node-red-contrib-chartjs --save
#RUN rm -r  ./node_modules/node-red-contrib-chartjs
COPY --chown=1000:0 ./node-red-contrib-chartjs ./default/node-red-contrib-chartjs
RUN npm install ./default/node-red-contrib-chartjs --save


