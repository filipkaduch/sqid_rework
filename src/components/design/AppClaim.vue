<template>
  <div :id="claimId">
    <template v-if="!reverse">
      <!-- <sqid-collapse-button :id="claimId">
        <snak :snak="mainsnak" :rank="rank" :short="narrow" />
      </sqid-collapse-button> -->
      <app-snak :snak="mainsnak" :rank="rank" :short="narrow" />
      <app-box class="qualifiers" v-for="(prop, pidx) in qualifierOrder" :key="pidx">
        <div v-for="(qualifier, qidx) in qualifiers(prop)" :key="qidx">
          <app-link :entityId="prop" />: <app-snak-value :snak="qualifier" />
        </div>
      </app-box>
      <app-box>
        <span v-if="!references.length" v-t="'entity.noReferences'" />
        <reference v-for="(reference, refId) in references" :key="refId" :reference="reference" />
      </app-box>
      <!--<b-collapse :id="`collapse-${claimId}`">
        <span v-if="!references.length" v-t="'entity.noReferences'" />
        <reference v-for="(reference, refId) in references" :key="refId" :reference="reference" />
      </b-collapse>-->
    </template>
    <template v-if="reverse">
      <app-snak :snak="mainsnak" :rank="rank" :short="narrow" reverse />
    </template>
  </div>
</template>

<script lang="ts">
import {ClaimsMap, EntityId} from "@/modules/entities/store/claims/types";
import {computed, defineComponent, PropType} from "vue";
import {Claim, Snak} from "@/api/wikidata/types";
import AppSnak from "@/components/design/AppSnak.vue";
import AppSnakValue from "@/components/design/AppSnakValue.vue";

export default defineComponent({
  name: 'AppClaim',
  components: {AppSnakValue, AppSnak},
  props: {
    entityId: {
      type: String,
      default: ''
    },
    propertyId: {
      type: String,
      default: ''
    },
    claim: {
      type: Object as PropType<Claim>,
      default: null
    },
    reverse: {
      type: Boolean,
      default: false
    },
    narrow: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const mainsnak = computed(() => {
        return props.claim.mainsnak;
    });

    const type = computed(() => props.claim.type);

    const claimId= computed(() => props.claim.id);

    const rank = computed(() => props.claim.rank);

    const references = computed(() => props.claim.references || []);

    const qualifierOrder = computed((): EntityId[] => {
      let order: EntityId[] = []

      if (!('qualifiers' in props.claim) ||
          (props.claim.qualifiers === undefined)) {
        return order
      }

      if ('qualifiers-order' in props.claim) {
        order = props.claim['qualifiers-order'] as EntityId[];
      } else if ('qualifiers' in props.claim) {
        order = Object.keys(props.claim.qualifiers);
      }

      return order;
    });

    const qualifiers = ((prop: EntityId): Snak[] => {
      if (!('qualifiers' in props.claim) ||
          (props.claim.qualifiers === undefined) ||
          !(prop in props.claim.qualifiers)) {
        return []
      }

      return props.claim.qualifiers[prop]
    });

    return {
      qualifiers,
      qualifierOrder,
      references,
      rank,
      claimId,
      mainsnak,
      type
    }
  }
});

</script>

<style lang="scss" scoped>
th {
  vertical-align: top;
  background: #ffffff;

  :not(.narrow) & {
    width: 25%;
  }

  .narrow & {
    width: 40%;
  }
}
</style>
