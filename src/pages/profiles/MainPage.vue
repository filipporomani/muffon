<template>
  <BaseProfilesPaginatedPageContainer
    :key="refreshKey"
    model="profile"
    :scope="scope"
    :limit="limit"
    :order="order"
    is-with-top-segment
    is-with-order-change
    is-with-reload-button
  >
    <template
      #default="slotProps"
    >
      <BaseProfilesSimpleList
        :profiles="slotProps[scope]"
        is-with-created
      />
    </template>
  </BaseProfilesPaginatedPageContainer>
</template>

<script>
import BaseProfilesPaginatedPageContainer
  from '@/components/containers/pages/profiles/BaseProfilesPaginatedPageContainer.vue'
import BaseProfilesSimpleList
  from '@/components/lists/profiles/BaseProfilesSimpleList.vue'
import orderChangeMixin from '@/mixins/orderChangeMixin'
import pageMixin from '@/mixins/pageMixin'
import {
  profiles as profilesLimits
} from '@/helpers/data/limits'

export default {
  name: 'MainPage',
  components: {
    BaseProfilesPaginatedPageContainer,
    BaseProfilesSimpleList
  },
  mixins: [
    orderChangeMixin,
    pageMixin
  ],
  data () {
    return {
      limit:
        profilesLimits.simple.large,
      scope: 'profiles',
      order: 'createdDesc'
    }
  }
}
</script>

<style lang="sass" scoped></style>
