import React, { FC, Dispatch, SetStateAction, useEffect, useState } from 'react'
import {
  Title,
  PageContainer,
  BodyText,
  Button,
  ButtonGroup,
  elMb7,
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
  address: any
  eTag: string
}

export const TestPage: FC = () => {
  const { connectSession } = useReapitConnect(reapitConnectBrowserSession)
  const [indexExpandedRow, setIndexExpandedRow] = useState<number | null>(null)
  const [dataProperties, setDataProperties] = useState<ListItemModel[]>([])
  const [editAddress, setEditAddress] = useState<EditAddress>({ id: '', address: {}, eTag: '' })
  const [loading, setLoading] = useState<boolean>(false)
  const [refresh, setRefresh] = useState<boolean>(false)
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
  }, [connectSession, refresh])

  const propertiesAddress = (dataProperties['_embedded'] || []).map((item) => ({
    id: item.id,
    address: item.address,
    selling: item.selling,
    eTag: item._eTag,
  }))

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
          <BodyText hasGreyText>Open the modal to update the address</BodyText>
          <ButtonGroup alignment="center">
            <Button
              intent="primary"
              chevronRight
              type="submit"
              onClick={() => {
                openModal()
                setEditAddress({ id: item.id, address: item.address, eTag: item.eTag })
              }}
            >
              Open Modal
            </Button>
          </ButtonGroup>
        </>
      ),
    },
  }))

  const { address, id, eTag } = editAddress

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
            <Input
              type="text"
              placeholder="Update the building name"
              style={{ width: '100%', marginBottom: '10px' }}
              value={address.buildingName}
              onChange={(e) =>
                setEditAddress({ ...editAddress, address: { ...editAddress.address, buildingName: e.target.value } })
              }
              defaultValue={address.buildingName}
            />
            <Input
              type="text"
              placeholder="Update the building number"
              style={{ width: '100%', marginBottom: '10px' }}
              value={address.buildingNumber}
              onChange={(e) =>
                setEditAddress({ ...editAddress, address: { ...editAddress.address, buildingNumber: e.target.value } })
              }
              defaultValue={address.buildingNumber}
            />
            <Input
              type="text"
              placeholder="Update the post code"
              style={{ width: '100%', marginBottom: '10px' }}
              value={address.postcode}
              onChange={(e) =>
                setEditAddress({ ...editAddress, address: { ...editAddress.address, postcode: e.target.value } })
              }
              defaultValue={address.postcode}
            />
            <ButtonGroup alignment="center">
              <Button intent="secondary" onClick={handleOnCloseModal(setIndexExpandedRow, closeModal)}>
                Close
              </Button>
              <Button
                intent="secondary"
                onClick={() => {
                  UpdatePropertiesApiService(connectSession, id, address, eTag)
                  setRefresh(!refresh)
                  closeModal()
                }}
              >
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
