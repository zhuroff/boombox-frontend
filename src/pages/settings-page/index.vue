<template>
  <section class="content">
    <div class="settings">
      <SettingsBackups />
      <SettingsUsers />

      <!-- <section class="settings__section" >
        <h2 class="settings__section-heading">
          {{ `${localize('headings.users')}${!isAdmin ? `: ${users?.[0].email}` : ''}` }}
        </h2>
        <table
          v-if="users.length"
          class="settings__table"
        >
          <thead class="settings__table-head">
            <tr class="settings__table-row">
              <th class="settings__table-cell">{{ localize('table.theads.id') }}</th>
              <th class="settings__table-cell">{{ localize('table.theads.login') }}</th>
              <th class="settings__table-cell">{{ localize('table.theads.email') }}</th>
              <th class="settings__table-cell">{{ localize('table.theads.role') }}</th>
              <th class="settings__table-cell">{{ localize('table.theads.actions') }}</th>
            </tr>
          </thead>
          <tbody class="settings__table-body">
            <tr
              v-for="user in users"
              :key="user._id"
              class="settings__table-row"
            >
              <td class="settings__table-cell">
                {{ user._id }}
              </td>
              <td class="settings__table-cell">
                {{ user.login }}
              </td>
              <td class="settings__table-cell">
                {{ user.email }}
              </td>
              <td class="settings__table-cell">
                {{ user.role }}
              </td>
              <td class="settings__table-cell">
                <Button
                  v-if="user._id === authConfig.user?._id"
                  size="small"
                  :label="localize('editPassword')"
                  @click="changePassword(user)"
                />
                <Button
                  v-if="user.role !== 'admin'"
                  size="small"
                  :label="localize('delete')"
                  @click="deleteUser(user)"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </section> -->
      
      <!-- <section
        v-if="isAdmin"
        class="settings__section"
      >
        <h2 class="settings__section-heading">{{ localize('headings.createUser') }}</h2>
        <div class="settings__form">
          <Form
            :schema="userSchema"
            :isResetAfterSubmit="true"
            :style="{ gap: '0.5rem', display: 'flex', flexDirection: 'column', maxWidth: '50%' }"
            @formSubmit="createUser"
          />
        </div>
      </section> -->
    </div>
  </section>
</template>

<script setup lang="ts">
// import { ref, reactive } from 'vue'
// import api from '~/app/api'
import { SettingsBackups, SettingsUsers } from '~widgets/settings'

// const users = reactive<UserResponse[]>([])
// const isReloading = ref(false)





// const createUser = async (payload: UserCreating) => {
//   if (payload.password !== payload.passwordConfirm) {
//     return setSnackbarMessage({
//       message: localize('userForm.errors.passwordsDoNotMatch'),
//       type: 'error',
//       time: 5000
//     })
//   }

//   try {
//     const { status, data } = await api.post<UserResponse>('/api/users/registration', payload)
//     if (status !== 201) {
//       throw new Error('Something went wrong')
//     }

//     setSnackbarMessage({
//       message: localize('userForm.created'),
//       type: 'success',
//       time: 5000
//     })

//     users.push(data)
//   } catch (error) {
//     console.error(error)
//   }
// }

// const fetchUsers = async () => {
//   try {
//     const response = await api.get<UserResponse[]>('/api/users')
//     users.length = 0
//     users.push(...response.data.sort((a, b) => a.role.localeCompare(b.role)))
//   } catch (error) {
//     console.error(error)
//   }
// }

// const changePassword = async (user: UserResponse) => {
//   console.log(user)
// }

// const deleteUser = async (user: UserResponse) => {
//   isReloading.value = true
//   try {
//     await api.delete(`/api/users/${user._id}`)
//     await fetchUsers()
//   } catch (error) {
//     console.error(error)
//   } finally {
//     isReloading.value = false
//   }
// }

// onMounted(() => {
//   if (isAdmin.value) {
//     Promise.all([fetchUsers].map((fn) => fn()))
//       .then(() => isPageLoaded.value = true)
//       .catch(console.error)
//   } else if (authConfig.value.user) {
//     isPageLoaded.value = true
//     users.push(authConfig.value.user)
//   }
// })
</script>

<style lang="scss" scoped>
@use '~/scss/variables' as var;

.settings {
  padding: 0 var.$basicPadding;
  display: grid;
  grid-template-columns: var.$coverWidth 1fr;
  grid-template-areas: 
    'actions users'
    'actions backups';
  gap: var.$mainPadding;
}
</style>
