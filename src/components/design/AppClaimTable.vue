<template>
  <app-collapse :is-open="opened" :narrow="narrow">
    <app-card class="overflow" v-if="!reverseClaims || !reverseClaims.size">
      <table :class="['table', 'table-striped', { narrow, 'table-sm': narrow }]">
        <template v-if="claims">
          <app-claim-group
              :entityId="entityId"
              :narrow="narrow"
              :propertyId="prop"
              :claims="statements(prop)"
              v-for="prop in claims.keys()"
              :key="prop" />
        </template>
      </table>
    </app-card>
    <app-tabs card v-if="reverseClaims && reverseClaims.size" tabs="" active-tab=""/>
    <app-box class="overflow"
           :title="$t('entity.ownStatements')"
           :disabled="!claims.size">
      <table :class="['table', 'table-striped', { narrow, 'table-sm': narrow }]">
        <template v-if="claims">
          <app-claim-group
              :entityId="entityId"
              :propertyId="prop"
              :narrow="narrow"
              :claims="statements(prop)"
              v-for="prop in claims.keys()"
              :key="prop" />
        </template>
      </table>
    </app-box>
    <app-box class="overflow" :title="$t('entity.reverseStatements')">
      <table :class="['table', 'table-striped', { narrow, 'table-sm': narrow }]">
        <template v-if="reverseClaims">
          <app-claim-group
              :entityId="entityId"
              :propertyId="prop"
              :narrow="narrow"
              :claims="reverseStatements(prop)"
              v-for="prop in reverseClaims.keys()"
              :key="prop"
              reverse />
        </template>
      </table>
    </app-box>
  </app-collapse>
</template>

<script lang="ts">
import {ClaimsMap, EntityId} from "@/modules/entities/store/claims/types";
import AppClaimGroup from "@/components/design/AppClaimGroup.vue";
import {defineComponent, PropType} from "vue";

export default defineComponent({
  name: 'AppClaimTable',
  components: {AppClaimGroup},
  props: {
    entityId: {
      type: String,
      default: ''
    },
    claims: {
      type: Map as PropType<ClaimsMap>,
      default: null
    },
    reverseClaims: {
      type: Map as PropType<ClaimsMap>,
      default: null
    },
    narrow: {
      type: Boolean,
      default: false
    },
    opened: {
      type: Boolean,
      default: true
    }
  },
  setup(props) {
    const statements = (propertyId: EntityId) => {
      if (props.claims) {
        return props.claims.get(propertyId);
      }

      return [];
    };

    const reverseStatements = (propertyId: EntityId) => {
      if (props.reverseClaims) {
        return props.reverseClaims.get(propertyId);
      }

      return [];
    };

    return {
      statements,
      reverseStatements
    };
  }
});
</script>

<style lang="scss" scoped>
.card-body {
  padding: 0 0;
}

.overflow {
  overflow: auto;
}

table {
  margin-bottom: 0;
  table-layout: fixed;
}

.narrow {
  font-size: 90%;
}
</style>
