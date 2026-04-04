<template>
    <div class="pdf-viewer">
        <div class="pdf-viewer__toolbar row items-center q-px-md q-py-sm q-gutter-sm">
            <div v-if="title" class="text-subtitle1 text-weight-bold" style="color: var(--text-primary)">
                {{ title }}
            </div>
            <q-space />
            <q-btn flat no-caps icon="print" :label="$t('common.actions.PRINT')" @click="print" />
            <q-btn flat no-caps icon="download" :label="$t('common.actions.DOWNLOAD')" @click="download" />
            <q-btn flat no-caps icon="close" :label="$t('common.actions.CLOSE')" @click="$emit('close')" />
        </div>

        <q-separator />

        <div class="pdf-viewer__frame">
            <div v-if="loading" class="pdf-viewer__loading">
                <q-spinner-dots size="40px" color="primary" />
            </div>
            <iframe v-else-if="pdfUrl" :src="pdfUrl" class="pdf-viewer__iframe" frameborder="0" />
        </div>
    </div>
</template>

<script>
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = pdfFonts.vfs;

export default {
    name: 'PdfViewer',

    props: {
        pdfContent: { type: Object, required: true },
        title: { type: String, default: '' },
    },

    emits: ['close'],

    data() {
        return {
            pdfUrl: null,
            loading: true,
            pdfDoc: null,
        };
    },

    watch: {
        pdfContent: {
            immediate: true,
            handler(content) {
                if (content) this.generatePdf(content);
            },
        },
    },

    methods: {
        generatePdf(content) {
            this.loading = true;
            this.pdfDoc = pdfMake.createPdf(content);
            this.pdfDoc.getDataUrl((dataUrl) => {
                this.pdfUrl = dataUrl;
                this.loading = false;
            });
        },

        print() {
            if (this.pdfDoc) this.pdfDoc.print();
        },

        download() {
            if (this.pdfDoc) {
                const filename = this.title ? `${this.title}.pdf` : `${this.$t('common.actions.DEFAULT_PDF_FILENAME')}.pdf`;
                this.pdfDoc.download(filename);
            }
        },
    },
};
</script>

<style scoped>
.pdf-viewer {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.pdf-viewer__frame {
    flex: 1;
    position: relative;
    overflow: hidden;
}

.pdf-viewer__iframe {
    width: 100%;
    height: 100%;
    border: none;
}

.pdf-viewer__loading {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
}
</style>
