<template>
  <app-box class="w-100">
    <app-box v-if="isLoading">
      <app-loader class="loader-position" />
    </app-box>
    <app-box v-else-if="entityComputed" class="w-100">
      <div v-if="entityComputed.banner" style="overflow: hidden;">
        <app-image :file="entityComputed.banner" width="850" />
      </div>
      <app-text variant="app-headline3" color="display-content-600" class="cursor-pointer">{{ entityComputed.label }}
        &nbsp;<small>(<a :href="wikidata">{{ entityId }}</a>)</small></app-text>
      <app-box>
        <ul class="list-inline line-separated">
          <li class="list-inline-item" v-for="alias in entityComputed.aliases" :key="alias.value">{{ alias }}</li>
        </ul>
      </app-box>
      <app-box padding-bottom="S">
        <app-text variant="app-paragraphLarge"><b>{{ $t('entity.description') }}</b>{{ entityComputed.description }}</app-text>
      </app-box>
      <app-box padding-bottom="S">
        <app-text v-if="entityComputed.propertyDatatype">
          {{ `${$t('entity.propertyDatatypeLabel')}: ${entityComputed.propertyDatatype}` }}
        </app-text>
        <app-box v-if="entityComputed.superProperties?.length">
          <ul class="comma-separated">
            <li v-for="(superProperty, supidx) of entityComputed.superProperties" :key="supidx">
             {{superProperty.value.id }}
            </li>
          </ul>
        </app-box>
        <app-box v-else-if="entityComputed.kind === 'property'">
          <b><app-link entityId="P1647" :query-entity-id="entityId" /></b>
          { entityComputed.kind }}
        </app-box>
        <app-box v-if="entityComputed.superClasses?.length">
          <b><app-link entityId="P279" :query-entity-id="entityId" />: </b>
          {{ $t('entity.superClasses', {instance: entityComputed.label}) }}
          <ul class="comma-separated">
            <li v-for="(superClass, sucidx) of entityComputed.superClasses" :key="sucidx">
              <app-link :entityId="superClass.value.id" :query-entity-id="entityId" />
            </li>
          </ul>
        </app-box>
        <app-box v-if="entityComputed.instanceClasses?.length">
          <b><app-link entityId="P31" :query-entity-id="entityId" />: </b>
          {{ $t('entity.instanceClasses', {instance: entityComputed.label}) }}
          <ul class="comma-separated">
            <li v-for="(instanceClass, incidx) of entityComputed.instanceClasses" :key="incidx">
              <app-link :entityId="instanceClass.value.id" :query-entity-id="entityId" />
            </li>
          </ul>
        </app-box>
        <app-box v-else>
          <b><app-link entityId="P31" :query-entity-id="entityId" /></b>
          {{ $t('entity.noInstanceClasses', {instance: entityComputed.label}) }}
        </app-box>
      </app-box>
      <app-box v-if="entityComputed?.kind === 'property'" class="w-100" padding-bottom="S">
        <app-box border-radius="basic" border="layout" padding-x="M" padding-y="S" class="collapse-header" flex-type="row" align="space-between">
          <app-text variant="subheadline">{{ $t('entity.propertyUsage') }}</app-text>
          <app-btn variant="ghost" icon-only @click="collapsibles['propertyUsage'] = !collapsibles['propertyUsage']">
            <template #icon>
              <app-icon :name="collapsibles['propertyUsage'] ? 'app-chevron-top-pull' : 'app-chevron-down-pull'" fill="display-content-600" />
            </template>
          </app-btn>
          <app-icon />
        </app-box>
        <app-collapse>
          <app-box border-radius="basic" border="layout" padding-x="M" padding-y="S" class="collapse-header">
            HERE
          </app-box>
        </app-collapse>
      </app-box>
      <app-box v-if="entityComputed.hierarchyStatistics?.directInstances || entityComputed.hierarchyStatistics?.allInstances" class="w-100" padding-bottom="S">
        <app-box border-radius="basic" border="layout" padding-x="M" padding-y="S" class="collapse-header" flex-type="row" align="space-between">
          <app-text variant="subheadline">{{ $t('entity.instances') }}</app-text>
          <app-btn variant="ghost" icon-only @click="collapsibles['instances'] = !collapsibles['instances']">
            <template #icon>
              <app-icon :name="collapsibles['instances'] ? 'app-chevron-top-pull' : 'app-chevron-down-pull'" fill="display-content-600" />
            </template>
          </app-btn>
          <app-icon />
        </app-box>
        <app-collapse :is-open="collapsibles['instances']" class="mt-2">
          <app-box border-radius="basic" border="layout" padding-x="M" padding-y="S" class="collapse-header">
            <table class="table table-striped">
              <tbody>
              <tr>
                <th v-t="'entity.directInstances'" />
                <td>{{ entityComputed.hierarchyStatistics.directInstances }}
                  <div class="four-lines" v-if="entityComputed.hierarchyStatistics.directInstances">
                    <ul class="comma-separated">
                      <li v-for="(exInstId, eiidx) of entityComputed.exampleInstances" :key="eiidx">
                        <app-link :entityId="exInstId" />
                      </li>
                    </ul>
                  </div>
                </td>
              </tr>
              <tr>
                <th v-t="'entity.allInstances'"
                    v-b-tooltip
                    :title="$t('entity.allInstancesDescription', { num: entityComputed.hierarchyStatistics.allSubclasses })" />
                <td>{{ entityComputed.hierarchyStatistics.allInstances }}</td>
              </tr>
              <tr>
                <th v-t="'entity.classTypicalProperties'"
                    v-b-tooltip
                    :title="$t('entity.classTypicalPropertiesDescription')" />
                <td><div class="four-lines">
                  <ul class="comma-separated">
                    <li v-for="(relatedId, relidx) of entityComputed.hierarchyStatistics.relatedProperties" :key="relidx">
                      <app-link :entityId="relatedId" />
                    </li>
                  </ul>
                </div></td>
              </tr>
              </tbody>
            </table>
          </app-box>
        </app-collapse>
      </app-box>
      <app-box v-if="entityComputed.hierarchyStatistics?.directSubclasses || entityComputed.hierarchyStatistics?.superClasses?.length" class="w-100" padding-bottom="S">
        <app-box border-radius="basic" border="layout" padding-x="M" padding-y="S" class="collapse-header" flex-type="row" align="space-between">
          <app-text variant="subheadline">{{ $t('entity.classification') }}</app-text>
          <app-btn variant="ghost" icon-only @click="collapsibles['instances'] = !collapsibles['instances']">
            <template #icon>
              <app-icon :name="collapsibles['instances'] ? 'app-chevron-top-pull' : 'app-chevron-down-pull'" fill="display-content-600" />
            </template>
          </app-btn>
          <app-icon />
        </app-box>
        <app-collapse :is-open="collapsibles['instances']" class="mt-2">
          <app-box border-radius="basic" border="layout" padding-x="M" padding-y="S" class="collapse-header">
            <table class="table table-striped">
              <tbody>
              <tr>
                <th v-t="'entity.directSuperclasses'" />
                <td v-if="entityComputed.superClasses.length">
                  <ul class="comma-separated">
                    <li v-for="(superClass, supcidx) of entityComputed.superClasses" :key="supcidx">
                      <app-link :entityId="superClass.value.id" />
                      <sqid-qualifier-icon :claim="superClass" />
                      <b-badge>{{ entityComputed.superClassesUsage.get(superClass.value.id) }}</b-badge>
                    </li>
                  </ul>
                </td>
                <td v-else v-t="'entity.noDirectSuperclasses'" />
              </tr>
              <tr>
                <th v-t="'entity.directSubclasses'" />
                <td>
                  <b-tabs>
                    <b-tab>
                      <template v-slot:title>
                        <i18n path="entity.directSubclassesInstances"
                              v-b-tooltip="$t('entity.directSubclassesInstancesDescription')">
                          <b-badge place="count">{{ Object.keys(entityComputed.subclassesInstances).length }}</b-badge>
                        </i18n>
                      </template>
                      <ul class="comma-separated">
                        <li v-for="(subClass, dsciidx) of entityComputed.sortedSubclassesInstances" :key="dsciidx">
                          <app-link :entityId="subClass.id" />
                          <b-badge>{{ subClass.count }}</b-badge>
                        </li>
                      </ul>
                    </b-tab>
                    <b-tab>
                      <template v-slot:title>
                        <i18n path="entity.directSubclassesSubclasses"
                              v-b-tooltip="$t('entity.directSubclassesSubclassesDescription')">
                          <b-badge place="count">{{ Object.keys(entityComputed.subclassesSubclasses).length }}</b-badge>
                        </i18n>
                      </template>
                      <ul class="comma-separated">
                        <li v-for="(subClass, dscsidx) of sortedSubclassesSubclasses" :key="dscsidx">
                          <app-link :entityId="subClass.id" />
                          <b-badge>{{ entityComputed.subClass.count }}</b-badge>
                        </li>
                      </ul>
                    </b-tab>
                    <b-tab>
                      <template v-slot:title>
                        <i18n path="entity.directSubclassesAll">
                          <b-badge place="count">{{ entityComputed.hierarchyStatistics.directSubclasses }}</b-badge>
                        </i18n>
                      </template>
                      <ul class="comma-separated">
                        <li v-for="(subClass, dscaidx) of entityComputed.exampleSubclasses" :key="dscaidx">
                          <app-link :entityId="subClass" />
                        </li>
                      </ul>
                    </b-tab>
                  </b-tabs>
                </td>
              </tr>
              <tr>
                <th v-t="'entity.allSubclasses'"
                    v-b-tooltip
                    :title="$t('entity.allSubclassesDescription')" />
                <td>{{ entityComputed.hierarchyStatistics.allSubclasses }}</td>
              </tr>
              </tbody>
            </table>
          </app-box>
        </app-collapse>
      </app-box>
      <app-box v-if="entityGroupedClaims">
        <app-claim-table
            v-if="showGroup('f')"
            :header="$t('entity.humanRelationshipStatements')"
            :entityId="entityId"
            :claims="group('f')"
            :reverseClaims="reverseGroup('f')"
            id="family"/>
        <app-claim-table
            v-if="showGroup('o')"
            :header="$t('entity.statements')"
            :entityId="entityId"
            :claims="group('o')"
            :reverseClaims="reverseGroup('o')"
            id="statements"/>
        <app-claim-table
            v-if="showGroup('m')"
            :header="$t('entity.mediaStatements')"
            :entityId="entityId"
            :claims="group('m')"
            :reverseClaims="reverseGroup('m')"
            id="media"/>
        <app-claim-table
            v-if="showGroup('w')"
           :header="$t('entity.wikiStatements')"
           :entityId="entityId"
           :claims="group('w')"
           :reverseClaims="reverseGroup('w')"
           id="wiki"/>
      </app-box>
    </app-box>
  </app-box>
</template>

<script lang="ts">
import {defineComponent, computed, onMounted, watch, reactive, toRefs} from 'vue';
import {useEntityStore} from "./store/entityStore";
import {usePropertiesStore} from "@/store/statistics/properties/propertiesStore";
import {useClaimsStore} from "./store/claims/claimsStore";
import {i18n} from "@/plugins/all";
import AppClaimTable from "@/components/design/AppClaimTable.vue";
import {PropertyClassification} from "@/store/statistics/properties/types";
import {Claim, EntityId} from "@/api/wikidata/types";
import {ClaimsMap} from "./store/claims/types";
import AppLoader from "@/components/main/loader/AppLoader.vue";
import useEntities from "@/modules/entities/composables/useEntities";
import AppImage from "@/components/main/image/AppImage.vue";
// @ts-ignore
const {t} = i18n.global;

export default defineComponent({
  name: 'Entity',
  components: {AppImage, AppLoader, AppClaimTable},
  props: {
    entityId: {
      type: String,
      default: null
    }
  },
  setup(props) {
    const entityGroupedClaims = computed(() => useEntityStore().entities[props.entityId].groupedClaims);

    const state = reactive({
      linkUrls: null as any,
      collapsibles: {
        instances: false,
        propertyUsage: false
      }
    });
    const updateLinks = () => {

      const urls: Array<{ url: string, label: any }> =
          [{ url: useClaimsStore().getWikidataUrl(props.entityId),
            label: t('entity.wikidataLink'),
          }]

      const homepage = useClaimsStore().getHomepage(props.entityId, props.entityId);
      if (homepage !== null) {
        urls.push({ url: homepage,
          label: t('entity.homepageLink')
        });
      }

      const wikipedia = useEntityStore().getWikipediaUrl(props.entityId);

      if (wikipedia !== null) {
        urls.push({ url: wikipedia,
          label: t('entity.wikipediaLink')
        });
      }

      urls.push({ url: useClaimsStore().getReasonatorUrl(props.entityId),
        label: t('entity.reasonatorLink')
      });

      state.linkUrls = urls;
    };

    watch(() => useClaimsStore().entities?.[props.entityId]?.claims, (val) => {
      if (val) {
        updateLinks();
      }
    });

    watch(() => props.entityId, async(val) => {
      console.log(val);
      if (val) {
        console.log(val);
        console.log(props.entityId);
        await useEntityStore().updateEntityData(props.entityId);
        await updateLinks();
        await usePropertiesStore().getUrlPattern(val, props.entityId);
        const entityData = await useEntityStore().getEntityData(val, val);
        console.log(entityData);
        console.log('ENTITIES IN WATCHER: ', useEntityStore().entities);
        if (useEntityStore().entities[val]) {
          console.log('INSIDE SETTING STUFF');
          useEntityStore().entities[val].entity.description = entityData.description;
          useEntityStore().entities[val].entity.label = entityData.label;
          useEntityStore().entities[val].entity.aliases = entityData.aliases;
          useEntityStore().entities[val].loading = false;
        }
        console.log(entityData);
      }
    });

    const entityComputed = computed(() => useEntityStore().entities[props.entityId]?.entity);

    const group = (kind: PropertyClassification): ClaimsMap => {
      if (useEntityStore().entities[props.entityId].groupedClaims && useEntityStore().entities[props.entityId].groupedClaims.has(kind)) {
        return useEntityStore().entities[props.entityId].groupedClaims.get(kind)!;
      }

      return new Map<EntityId, Claim[]>();
    }

    const reverseGroup = (kind: PropertyClassification) => {
      if (useEntityStore().entities[props.entityId].groupedReverseClaims && useEntityStore().entities[props.entityId].groupedReverseClaims.has(kind)) {
        return useEntityStore().entities[props.entityId].groupedReverseClaims.get(kind)!;
      }

      return new Map<EntityId, Claim[]>();
    }

    const showGroup = (kind: PropertyClassification) => {
      if (kind === 'i') {
        return group(kind).size > 0
      }

      return (group(kind).size + reverseGroup(kind).size) > 0
    };


    const links = computed(() => {
      return state.linkUrls;
    });

    const compareByCount = (left: { count: number }, right: { count: number }) => {
      const lhs = left.count;
      const rhs = right.count;

      if (lhs < rhs) {
        return 1;
      }

      if (lhs > rhs) {
        return -1;
      }

      return 0;
    };

    const sortedSubclassesInstances = computed(() => {
      const result = [];


      for (const [subclassId, count] of Object.entries(entityComputed.value?.subclassesInstances)) {
        result.push({ id: subclassId,
          count
        });
      }

      // @ts-ignore
      return result.sort(compareByCount);
    });

    const sortedSubclassesSubclasses = computed(() => {
      const result = [];

      for (const [subclassId, count] of Object.entries(entityComputed.value?.subclassesSubclasses)) {
        result.push({ id: subclassId,
          count
        });
      }

      // @ts-ignore
      return result.sort(compareByCount);
    });

    const averagePropertyStatements = computed(() => {
      const statements = useEntityStore().entities[props.entityId].propertyUsage.statements;
      const items = useEntityStore().entities[props.entityId].propertyUsage.items || 1;

      return Math.round(100 * statements / items) / 100
    });

    const isLoading = computed(() => {
      return useEntityStore().entities?.[props.entityId]?.loading ?? true;
    });

    onMounted(async () => {
      if (props.entityId) {
        await useEntityStore().updateEntityData(props.entityId);
        await updateLinks();
        await usePropertiesStore().getUrlPattern(props.entityId, props.entityId);
      }
    });

    return {
      ...toRefs(state),
      entityComputed,
      sortedSubclassesSubclasses,
      averagePropertyStatements,
      isLoading,
      group,
      showGroup,
      reverseGroup,
      entityGroupedClaims
    };
  }
});
</script>

<style lang="scss">
.loader-position {
  position: relative;
  top: 50%;
  left: calc(50% - 10px);
}
.collapse-header {
  background-color: map-get($app-colors, 'separate-content-100');
}
</style>

