#ORBITAL CORE KERNEL
jscodeshift -t ./scripts/kernel/kernel.js ../react/src/Orbital/withOrbital.js
cp -a ./data/kernel.json ./data/Career-Orbital-COre.json


#ORBITAL KB KERNEL
jscodeshift -t ./scripts/kernel/kernel.js ../react/src/OrbitalKb/App.js
cp -a ./data/kernel.json ./data/Career-Orbital-Kb.json


#ORBITAL ECOMMERCE KERNEL
jscodeshift -t ./scripts/kernel/kernel.js ../react/src/OrbitalEcommerce/App.js
cp -a ./data/kernel.json ./data/Career-Orbital-Ecommerce.json

jscodeshift -t ./scripts/kernel/kernel.js ../react/src/OrbitalEcommerce/StoreFront/App.js
cp -a ./data/kernel.json ./data/Career-Orbital-ECOMMERCE-Front.json

jscodeshift -t ./scripts/kernel/kernel.js ../react/src/OrbitalEcommerce/StoreAdmin/App.js
cp -a ./data/kernel.json ./data/Career-Orbital-ECOMMERCE-Admin.json


#ORBITAL CMS KERNEL
jscodeshift -t ./scripts/kernel/kernel.js ../react/src/OrbitalCMS/App.js
cp -a ./data/kernel.json ./data/Career-Orbital-CMS.json

#ORBITAL CHAT KERNEL
jscodeshift -t ./scripts/kernel/kernel.js ../react/src/OrbitalCMS/App.js
cp -a ./data/kernel.json ./data/Career-Orbital-Chat.json
