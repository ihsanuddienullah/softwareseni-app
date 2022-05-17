import { ReapitConnectSession } from '@reapit/connect-session'
import { ListItemModel } from '@reapit/foundations-ts-definitions'
import { URLS, BASE_HEADERS } from '../constants/api'

export const configurationAppointmentsApiService = async (
  session: ReapitConnectSession | null,
): Promise<ListItemModel[] | undefined> => {
  try {
    if (!session) return

    const response = await fetch(`${window.reapit.config.platformApiUrl}${URLS.CONFIGURATION_APPOINTMENT_TYPES}`, {
      method: 'GET',
      headers: {
        ...BASE_HEADERS,
        Authorization: `Bearer ${session?.accessToken}`,
      },
    })

    if (response.ok) {
      const responseJson: Promise<ListItemModel[] | undefined> = response.json()
      return responseJson
    }

    throw new Error('No response returned by API')
  } catch (err) {
    const error = err as Error
    console.error('Error fetching Configuration Appointment Types', error.message)
  }
}

export const GetPropertiesApiService = async (
  session: ReapitConnectSession | null,
): Promise<ListItemModel[] | undefined> => {
  try {
    if (!session) return

    const response = await fetch(`${window.reapit.config.platformApiUrl}${URLS.PROPERTIES}?marketingMode=['selling']`, {
      method: 'GET',
      headers: {
        ...BASE_HEADERS,
        Authorization: `Bearer ${session?.accessToken}`,
      },
    })

    if (response.ok) {
      const responseJson: Promise<ListItemModel[] | undefined> = response.json()
      return responseJson
    }

    throw new Error('No response returned by API')
  } catch (err) {
    const error = err as Error
    console.error('Error fetching Configuration Appointment Types', error.message)
  }
}

export const UpdatePropertiesApiService = async (
  session: ReapitConnectSession | null,
  id: string,
  buildingName: string,
): Promise<ListItemModel[] | undefined> => {

  const formBody = new URLSearchParams()
  formBody.append('buildingName', buildingName)

  try {
    if (!session) return

    const response = await fetch(`${window.reapit.config.platformApiUrl}${URLS.PROPERTIES}/${id}`, {
      method: 'PATCH',
      headers: {
        ...BASE_HEADERS,
        Authorization: `Bearer ${session?.accessToken}`,
      },
      body: formBody,
    })

    if (response.ok) {
      const responseJson: Promise<ListItemModel[] | undefined> = response.json()
      return responseJson
    }

    throw new Error('No response returned by API')
  } catch (err) {
    const error = err as Error
    console.error('Error fetching Configuration Appointment Types', error.message)
  }
}
