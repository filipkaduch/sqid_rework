<template>
  <span>
    <template v-if="valuetype === 'wikibase-entityid'">
      <app-link :entityId="value.value.id" :query-entity-id="queryEntityId" />
    </template>
    <template v-else-if="valuetype === 'string'">
      <template v-if="maybeLink">
        <a :href="maybeLink" target="_blank" :title="value.value">
          {{ maybeShortenedString }}
        </a>
      </template>
      <template v-else>
        {{ maybeShortenedString }}
      </template>
    </template>
    <template v-else-if="valuetype === 'time'">{{ timevalue(timedate) }}
      <i18n path="entity.calendar" v-if="calendar(timedate) !== 'Q1985727'">
        <app-link place="calendar" :entityId="calendar(timedate)" :query-entity-id="queryEntityId" />
      </i18n>
    </template>
    <template v-else-if="valuetype === 'quantity'">
      <i18n path="entity.quantityUnit" v-if="value.value.unit && value.value.unit !== '1'">
        <span place="amount">{{ amount }}</span>
        <span place="unit">
          <app-link :entityId="unit"  :query-entity-id="queryEntityId" />
        </span>
      </i18n>
      <i18n path="entity.quantityNoUnit" v-else>
        <span place="amount">{{ amount }}</span>
      </i18n>
    </template>
    <template v-else-if="valuetype === 'globecoordinate'">{{ coordinate(globeCoordinate) }}
      <i18n path="entity.globe" v-if="globe(globeCoordinate) !== 'Q2'">
        <app-link place="globe" :entityId="globe(globeCoordinate)" :query-entity-id="queryEntityId" />
      </i18n>
    </template>
    <template v-else-if="valuetype === 'monolingualtext'">
      <i18n path="entity.monolingualText">
        <span place="text">{{ value.value.text }}</span>
        <small place="language">[{{ value.value.language }}]</small>
      </i18n>
    </template>
    <template v-else>{{ value }}</template>
  </span>
</template>

<script lang="ts">
import {computed, defineComponent, onMounted, PropType, ref} from 'vue';
import {
  Datavalue,
  EntityId,
  GlobeCoordinateValue,
  QuantityDataValue,
  Snak,
  StringDataValue,
  TimeDataValue
} from "@/api/wikidata/types";
import {usePropertiesStore} from "@/store/statistics/properties/propertiesStore";
import {useEntityStore} from "@/modules/entities/store/entityStore";
import {entityValue} from "@/api/wikidata/sparql";
import {coordinateFromGlobeCoordinate, dateFromTimeData} from "@/api/wikidata/wikidata";
import {i18n} from '@/plugins/all';
const {t} = i18n.global;
export default defineComponent({
  name: 'AppDataValue',
  props: {
    value: {
      type: Object as PropType<Datavalue>,
      default: null
    },
    propertyId: {
      type: String,
      default: ''
    },
    short: {
      type: Boolean,
      default: false
    },
    queryEntityId: {
      type: String as PropType<EntityId>,
      default: ''
    },
  },
  setup(props) {
    let datatype = ref('');
    let urlPattern = ref('');


  const valuetype = computed(() => props.value.type);

  const timedate = computed(() => dateFromTimeData(props.value as TimeDataValue));

  const globeCoordinate = computed(() => coordinateFromGlobeCoordinate(props.value as GlobeCoordinateValue));

  const timestamp = (date: { time: Date }) => (date.time);

  const timeformat = (date: { format: string }) => (date.format);

  const calendar = (date: { calendar: EntityId }) => (date.calendar);

  const timevalue = (date: any) => {
      if (!timestamp(date).toString().startsWith('Invalid')) {
        // valid date, use localised format
        return `${timestamp(date)} ${timeformat(date)}`
      }

      // date is out of range for javascript Date objects, format manually
      let result = date.year

      if (result.precision >= 10) {
        result += `-${date.month}`
      }

      if (result.precision >= 11) {
        result += `-${date.day}`
      }

      if (result.precision >= 12) {
        result += `T${date.hour}`
      }

      if (result.precision >= 13) {
        result += `:${date.minute}`
      }

      if (result.precision >= 14) {
        result += `:${date.second}`
      }

      if (result.precision >= 12) {
        result += `Z`
      }

      if (date.negative) {
        return t('entity.dateBC', {date: result})
      }

      return result
    }

  const coordinate = (coordinate: { coordinate: string }) => (coordinate.coordinate);

  const globe = (coordinate: { globe: EntityId }) => (coordinate.globe);

  const maybeShortenedString = computed(() => {
      let display = (props.value as StringDataValue).value;

      if (props.short && display.length > 15) {
        display = `${display.slice(0, 6)}…${display.slice(display.length - 6)}`;
      }

      return display;
    });

  const maybeLink = computed(() => {
      const value = (props.value as StringDataValue).value;

      switch (datatype.value) {
        case 'url':
          return value;
        case 'commonsMedia':
          const filename = value.replace(/ /g, '_');
          return `https://commons.wikimedia.org/wiki/File:${filename}`;
        default:
          if (urlPattern.value) {
            return urlPattern.value.replace('$1', value);
          }
      }

      return '';
    });

  const amount = computed(() => {
      const value = (props.value as QuantityDataValue).value
      const amount = value.amount

      if (amount.startsWith('+')) {
        return amount.slice(1)
      }

      return amount
    });

  const unit = computed(() => {
      const value = (props.value as QuantityDataValue).value
      const unit = value.unit || '1'

      if (unit !== '1') {
        return entityValue({ value: unit, type: 'uri' })
      }

      return unit
    });
  const onUpdate = async() => {
      datatype.value = '';
      urlPattern.value = '';

      if (valuetype.value === 'string') {
        const datatypes = await useEntityStore().getPropertyDatatypes([props.propertyId], props.queryEntityId);

        if (datatypes && props.propertyId in datatypes) {
          datatype.value = datatypes[props.propertyId];
        }

        const pattern = await usePropertiesStore().getUrlPattern(props.propertyId, props.queryEntityId);

        if (pattern) {
          urlPattern.value = pattern;
        }
      }
    }

    onMounted(() => {
      onUpdate();
    });

    return {
      onUpdate,
      amount,
      unit,
      maybeLink,
      maybeShortenedString,
      globe,
      globeCoordinate,
      coordinate,
      timevalue,
      timedate,
      calendar,
      valuetype
    };
  }
});
</script>

<style lang="scss" scoped>
span.deprecated {
  text-decoration: line-through;
}
</style>
