<template>
    <app-box class="w-100 h-100" padding-bottom="S">
        <app-box v-if="isLoading" class="h-100">
            <app-loader class="loader-position" />
        </app-box>
        <app-box v-else-if="cveComputed" class="w-100">
            <app-box flex-type="row" align="space-between" :class="{'fixed-header': fullscreen}">
                <app-text v-if="cveComputed[cvePropertyTypes.TITLE]" variant="app-headline3" color="display-content-600" class="cursor-pointer">
                    {{ `${cveComputed[cvePropertyTypes.TITLE]}`}}</app-text>
                <app-tooltip>
                    <template #icon>
                        <app-btn variant="ghost" icon-only @click="fullScreen">
                            <template #icon>
                                <app-icon :name="fullscreen ? 'app-icon-close' : 'app-fullscreen'" fill="display-content-600" />
                            </template>
                        </app-btn>
                    </template>
                    <template #tooltip>
                        {{ $t('t_fullscreen') }}
                    </template>
                </app-tooltip>
            </app-box>
            <app-box>
                <app-box padding-bottom="M">
                    <app-text variant="subheadlineRegular" v-if="cveComputed[malwarePropertyTypes.WAS_CREATED] || cveComputed[malwarePropertyTypes.WAS_LAST_MODIFIED]">
                        <b>{{ $t('entity.created') }}</b>{{ cveComputed[malwarePropertyTypes.WAS_CREATED] }} | <b>{{ $t('entity.modified') }}</b>{{ cveComputed[malwarePropertyTypes.WAS_LAST_MODIFIED] }}
                    </app-text>
                </app-box>
            </app-box>
            <app-box padding-bottom="M">
                <app-text variant="app-paragraphLarge"><b>{{ $t('entity.description') }}</b></app-text>
                <app-text variant="app-paragraphLarge">
                    {{ cveComputed[malwarePropertyTypes.HAS_DESCRIPTION]}}
                </app-text>
            </app-box>
            <app-box v-if="cveComputed[cvePropertyTypes.NOTES].length > 0" padding-bottom="M">
                <app-box class="collapse-header" padding-x="S" padding-y="XS" border-radius="basic" flex-type="row" align="space-between" align-y="center">
                    <app-text variant="app-paragraphLarge"><b>{{ $t('entity.notes') }}</b></app-text>
                    <app-btn variant="ghost" icon-only @click="collapses[cvePropertyTypes.NOTES] = !collapses[cvePropertyTypes.NOTES]">
                        <template #icon>
                            <app-icon :name="collapses[cvePropertyTypes.NOTES] ? 'app-chevron-top-pull' : 'app-chevron-down-pull'" fill="display-content-600" />
                        </template>
                    </app-btn>
                </app-box>
                <app-collapse :is-open="collapses[cvePropertyTypes.NOTES]" class="mt-2">
                    <app-box class="collapse-header" padding-x="S" padding-y="XS" border-radius="basic" align-y="center">
                        <app-scroll-table :items="cveMappedNotes" @new-query="newQueryAction"/>
                    </app-box>
                </app-collapse>
            </app-box>
            <app-box v-if="cveComputed[cvePropertyTypes.REFERENCES].length > 0" padding-bottom="M">
                <app-box class="collapse-header" padding-x="S" padding-y="XS" border-radius="basic" flex-type="row" align="space-between" align-y="center">
                    <app-text variant="app-paragraphLarge"><b>{{ $t('entity.references') }}</b></app-text>
                    <app-btn variant="ghost" icon-only @click="collapses[cvePropertyTypes.REFERENCES] = !collapses[cvePropertyTypes.REFERENCES]">
                        <template #icon>
                            <app-icon :name="collapses[cvePropertyTypes.REFERENCES] ? 'app-chevron-top-pull' : 'app-chevron-down-pull'" fill="display-content-600" />
                        </template>
                    </app-btn>
                </app-box>
                <app-collapse :is-open="collapses[cvePropertyTypes.REFERENCES]" class="mt-2">
                    <app-box class="collapse-header" padding-x="S" padding-y="XS" border-radius="basic" align-y="center">
                        <app-scroll-table :items="cveMappedRefs" @new-query="newQueryAction"/>
                    </app-box>
                </app-collapse>
            </app-box>
        </app-box>
    </app-box>
</template>

<script lang="ts">
import {computed, defineComponent, reactive, ref, toRefs, watch} from "vue";
import AppLoader from "@/components/main/loader/AppLoader.vue";
import {objectCaseMapper, objectCaseStyles} from "@/util/objectCaseMapper";
import AppPaginator from "@/components/design/AppPaginator.vue";
import AppScrollTable from "@/components/design/AppScrollTable.vue";
import {DataSourceType, useQueriesStore} from "@/modules/queries/store/queriesStore";
import {NoteData, RefData} from "@/api/cve/types";
import {cvePropertyTypes} from "@/api/cve/cve";
import {useCVEStore} from "@/modules/cves/store/cveStore";
import {malwarePropertyTypes} from "@/api/malwares/malwares";

export default defineComponent({
    name: 'Cve',
    methods: {objectCaseMapper},
    computed: {
        cvePropertyTypes() {
            return cvePropertyTypes;
        },
        malwarePropertyTypes() {
            return malwarePropertyTypes;
        }
    },
    components: {AppScrollTable, AppPaginator, AppLoader},
    props: {
        cveId: {
            type: String,
            default: null
        },
        queryId: {
            type: String,
            default: null
        }
    },
    emits: ['fullscreen', 'newQuery'],
    setup(props, {emit}) {
        const isLoading = computed(() => useCVEStore().cves[props.cveId]?.loading ?? true);
        const cveComputed = computed(() => useCVEStore().cves[props.cveId]);
        const cveMappedNotes = computed(() => cveComputed.value?.[cvePropertyTypes.NOTES]?.map((note: NoteData) => ({
            name: note?.title ?? note.type,
            description: note.value,
            source: DataSourceType.CVE_DOMAIN
        })));
        const cveMappedRefs = computed(() => cveComputed.value?.[cvePropertyTypes.REFERENCES]?.map((note: RefData) => ({
            name: note.id,
            id: props.cveId,
            description: note.description,
            source: DataSourceType.CVE_DOMAIN
        })));
        const cveDescription = ref(null);
        const state = reactive({
            collapses: {
                [cvePropertyTypes.NOTES]: false,
                [cvePropertyTypes.REFERENCES]: false
            },
            fullscreen: false
        });
        const fullScreen = () => {
            state.fullscreen = !state.fullscreen;
            emit('fullscreen');
        };

        const newQueryAction = () => {
            state.fullscreen = false;
            emit('newQuery');
        };

        watch(isLoading, (val) => {
            if (!val) {
                emit('newQuery');
            }
        });

        const getTextAfterLastSlash = (url: string) => {
            const parts = url.split('/');
            return parts[parts.length - 1];
        }
        const openNewQuery = (url: string) => {
            console.log(url);
        };

        const getLinkUrl = (word: string) => {
            const textAfterSlash = getTextAfterLastSlash(word);
            return textAfterSlash.substring(0, textAfterSlash.length - 1);
        };

        watch(() => props.cveId, async(val) => {
            if (val) {
                useCVEStore().cves[val].loading = true;
                await useCVEStore().updateCveData(val);
                // @ts-ignore
                useQueriesStore().queries.find((query) => query.id === props.queryId).name = val;
                useCVEStore().cves[val].loading = false;
            }
        }, {immediate: true});
        return {
            isLoading,
            cveComputed,
            objectCaseStyles,
            fullScreen,
            newQueryAction,
            ...toRefs(state),
            openNewQuery,
            cveDescription,
            getLinkUrl,
            cveMappedNotes,
            cveMappedRefs
        }
    }
});
</script>
<style lang="scss">
.collapse-header {
  background-color: map-get($app-colors, 'separate-content-100');
}
.desc-link {
  text-decoration: underline;
}
</style>
