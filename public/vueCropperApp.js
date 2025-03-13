Vue.component('cropper-component', {
    props: ['initialImage'],
    data() {
        return {
            currentCoordinates: null // guarda as coordenadas atuais do recorte
        };
    },
    template: `
        <div>
            <advanced-cropper
                ref="cropper"
                :src="initialImage"
                :stencil-props="{ aspectRatio: 1 }"
                @update="onCropperUpdate"
                style="width: 100%; height: 400px;">
            </advanced-cropper>
            <button id="cropper-confirm-btn" @click="onConfirmCrop">Confirmar Imagem</button>
        </div>
    `,
    methods: {
        onCropperUpdate(payload) {
            console.log("Evento update recebido:", payload);
            // Verifique a estrutura do payload detalhadamente:
            let coords = payload.detail || payload;
            console.log("Coordenadas extraídas:", coords);
            if (coords && typeof coords.width === "number" && typeof coords.x === "number") {
                this.currentCoordinates = {
                    left: coords.x,
                    top: coords.y,
                    width: coords.width,
                    height: coords.height
                };
            } else {
                console.warn("Payload não possui as coordenadas esperadas", payload);
            }
        },
        onConfirmCrop() {
            const coords = this.currentCoordinates;
            if (!coords || typeof coords.width !== "number") {
                console.error("Coordenadas não disponíveis no cropper.");
                return;
            }
            const cropper = this.$refs.cropper;
            // Procura a imagem interna do advanced-cropper
            const img = cropper.$el.querySelector("img");
            if (!img) {
                console.error("Imagem não encontrada dentro do cropper.");
                return;
            }
            // Cria um canvas com o tamanho do recorte
            const canvas = document.createElement("canvas");
            canvas.width = coords.width;
            canvas.height = coords.height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(
                img,
                coords.left, coords.top, coords.width, coords.height,
                0, 0, coords.width, coords.height
            );
            // Converte o canvas para blob e segue com o processamento
            canvas.toBlob((blob) => {
                console.log("Blob do recorte:", blob);
                // Continue com o upload ou processamento do blob conforme necessário...
            }, "image/png");
        }
    }
});

window.vueCropperApp = new Vue({
    el: '#vue-cropper-app',
    data: {
        initialImage: '/images/default-avatar.jpg',
        isCropperVisible: false
    },
    methods: {
        showCropper() {
            this.isCropperVisible = true;
        },
        hideCropper() {
            this.isCropperVisible = false;
        }
    }
});