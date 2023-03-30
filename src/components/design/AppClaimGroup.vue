<template>
  <tbody>
    <tr :title="tooltip"
        v-for="(claim, cidx) in claims.slice(0, hideAllBut)"
        :key="cidx">
      <th :rowspan="shownRows" v-if="cidx === 0">
        <app-link :entityId="propertyId" />
        <template v-if="hiddenClaims">
          <br>
        </template>
      </th>
      <td>
        <app-claim :entityId="entityId"
               :propertyId="propertyId"
               :claim="claim"
               :reverse="reverse"
               :narrow="narrow" />
      </td>
    </tr>
    <tr
        v-for="(claim, cidx) in claims.slice(hideAllBut)"
        :key="cidx + hideAllBut"
        @show="onToggle(true)"
        @hidden="onToggle(false)">
      <app-collapse :is-open="true">
        <app-claim :entityId="entityId"
               :propertyId="propertyId"
               :claim="claim"
               :reverse="reverse"
               :narrow="narrow" />
      </app-collapse>
    </tr>
  </tbody>
</template>

<script lang="ts">
import {ClaimsMap, EntityId} from "@/modules/entities/store/claims/types";
import AppClaim from "@/components/design/AppClaim.vue";
import {computed, defineComponent, onMounted, PropType, ref} from "vue";
import {i18n} from "@/plugins/all";
import {useTermsStore} from "@/modules/entities/store/terms/termsStore";

export default defineComponent({
  name: 'AppClaimGroup',
  components: {AppClaim},
  props: {
    entityId: {
      type: String,
      default: ''
    },
    propertyId: {
      type: String,
      default: ''
    },
    claims: {
      type: Map as PropType<ClaimsMap>,
      default: null
    },
    reverse: {
      type: Boolean,
      default: false
    },
    hideAllBut: {
      type: Number,
      default: 0
    },
    narrow: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    let shownRows = ref(Math.min(props.claims.length, props.hideAllBut));
    let label = props.propertyId;

    const onToggle = (shown: boolean) => {
      const claims = props.claims.length

      if (shown) {
        shownRows.value = claims
      } else {
        shownRows.value = Math.min(props.hideAllBut, claims)
      }
    };
    const collapseId = computed(() => {
      const direction = props.reverse ? 'reverse' : 'statements'

      return `${direction}-${props.entityId}-${props.propertyId}`
    });

    const hiddenClaims = computed(() => {
      return Math.max(0, props.claims.length - props.hideAllBut)
    });

    const tooltip = computed(() => {
      return `${label} (${props.propertyId})`
    });

    const updateLabel = async () => {
      label = await useTermsStore().getLabel({
        entityId: props.propertyId,
        lang: i18n.global.locale,
      })
    }

    onMounted(() => {
      updateLabel();
    });

    return {
      tooltip,
      hiddenClaims,
      collapseId,
      onToggle,
      shownRows
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
