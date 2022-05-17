import React, { FC, Dispatch, SetStateAction, useEffect, useState } from 'react'
import {
  Title,
  PageContainer,
  BodyText,
  Button,
  ButtonGroup,
  elMb7,
  elMb6,
  elSpan2,
  PersistantNotification,
  Table,
  Loader,
  useModal,
  Input,
  //   StatusIndicator,
} from '@reapit/elements'
import { useReapitConnect } from '@reapit/connect-session'
import { reapitConnectBrowserSession } from '../../core/connect-session'
import { GetPropertiesApiService, UpdatePropertiesApiService } from '../../platform-api/configuration-api'
import { ListItemModel } from '@reapit/foundations-ts-definitions'

export const handleOnCloseModal =
  (setIndexExpandedRow: Dispatch<SetStateAction<number | null>>, closeModal: () => void) => () => {
    setIndexExpandedRow(null)
    closeModal()
  }

interface EditAddress {
  id: string
  buildingName: string
}

export const TestPage: FC = () => {
  const { connectSession } = useReapitConnect(reapitConnectBrowserSession)
  const [indexExpandedRow, setIndexExpandedRow] = useState<number | null>(null)
  const [dataProperties, setDataProperties] = useState<ListItemModel[]>([])
  const [editBuildingName, setEditBuildingName] = useState<EditAddress>({ id: '', buildingName: '' })
  const [loading, setLoading] = useState<boolean>(false)
  const { Modal, openModal, closeModal } = useModal()

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true)
      const serviceResponse = await GetPropertiesApiService(connectSession)
      if (serviceResponse) {
        setDataProperties(serviceResponse)
      }
      setLoading(false)
    }

    if (connectSession) {
      fetchProperties()
    }
  }, [connectSession])

  const propertiesAddress = (dataProperties['_embedded'] || []).map((item) => ({
    id: item.id,
    address: item.address,
    selling: item.selling,
  }))

  console.log(propertiesAddress)

  const dataRows = (propertiesAddress || []).map((item) => ({
    cells: [
      {
        label: 'Building Name',
        value: item.address.buildingName,
        className: elSpan2,
        icon: 'homeSystem',
        cellHasDarkText: true,
        narrowTable: {
          showLabel: true,
        },
      },
      {
        label: 'Building Number',
        value: item.address.buildingNumber,
        narrowTable: {
          showLabel: true,
        },
      },
      {
        label: 'Post Code',
        value: item.address.postcode,
        narrowTable: {
          showLabel: true,
        },
      },
      {
        label: 'Agency',
        value: item.selling?.agency,
        narrowTable: {
          showLabel: true,
        },
      },
      {
        label: 'Price',
        value: item.selling?.price,
        narrowTable: {
          showLabel: true,
        },
      },
      {
        label: 'Recommended Price',
        value: item.selling?.recommendedPrice,
        narrowTable: {
          showLabel: true,
        },
      },
    ],
    expandableContent: {
      content: (
        <>
          <BodyText hasGreyText>Open the modal to update the building name</BodyText>
          <ButtonGroup alignment="center">
            <Button
              intent="primary"
              chevronRight
              type="submit"
              onClick={() => {
                openModal()
                setEditBuildingName({ id: item.id, buildingName: item.address.buildingName })
              }}
            >
              Open Modal
            </Button>
          </ButtonGroup>
        </>
      ),
    },
  }))

  const { buildingName, id } = editBuildingName

  return (
    <PageContainer>
      <Title>Properties for Sale</Title>
      <PersistantNotification className={elMb7} isExpanded intent="secondary" isInline isFullWidth>
        Softwareseni Technical Test
      </PersistantNotification>
      <br />
      {loading ? (
        <Loader label="loading" />
      ) : (
        <>
          <Table
            numberColumns={8}
            indexExpandedRow={indexExpandedRow}
            setIndexExpandedRow={setIndexExpandedRow}
            rows={dataRows}
          />
          <Modal title="Update Address">
            <PersistantNotification className={elMb6} isExpanded isInline isFullWidth intent="danger">
              This form is not finisihed yet
            </PersistantNotification>
            <Input
              type="text"
              placeholder="Update the building name"
              style={{ width: '100%', marginBottom: '10px' }}
              defaultValue={buildingName}
            />
            <ButtonGroup alignment="center">
              <Button intent="secondary" onClick={handleOnCloseModal(setIndexExpandedRow, closeModal)}>
                Close
              </Button>
              <Button intent="secondary" onClick={() => UpdatePropertiesApiService(connectSession, id, buildingName)}>
                Submit
              </Button>
            </ButtonGroup>
          </Modal>
        </>
      )}
    </PageContainer>
  )
}

export default TestPage
