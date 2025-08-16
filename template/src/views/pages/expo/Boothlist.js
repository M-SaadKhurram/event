import { CCard, CCardBody, CCardHeader, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CBadge } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilBolt, cilWifiSignal4, cilLocationPin } from '@coreui/icons'

// booths: array from API response
const BoothsList = ({ booths }) => (
  <CCard className="mb-4">
    <CCardHeader>
      <h5 className="mb-0 text-primary">Booths in this Expo</h5>
      <small className="text-body-secondary">
        All booths for: <strong>{booths[0]?.expo_id?.title || 'Expo'}</strong>
      </small>
    </CCardHeader>
    <CCardBody>
      {booths.length === 0 ? (
        <div className="text-center text-muted py-4">No booths found for this expo.</div>
      ) : (
        <CTable hover responsive>
          <CTableHead>
            <CTableRow className="bg-light">
              <CTableHeaderCell>Booth #</CTableHeaderCell>
              <CTableHeaderCell>Floor</CTableHeaderCell>
              <CTableHeaderCell>Size</CTableHeaderCell>
              <CTableHeaderCell>Status</CTableHeaderCell>
              <CTableHeaderCell>Price</CTableHeaderCell>
              <CTableHeaderCell>Features</CTableHeaderCell>
              <CTableHeaderCell>Notes</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {booths.map(booth => (
              <CTableRow key={booth._id}>
                <CTableDataCell><strong>{booth.booth_number}</strong></CTableDataCell>
                <CTableDataCell>{booth.floor}</CTableDataCell>
                <CTableDataCell>{booth.length} x {booth.width} {booth.size_unit}</CTableDataCell>
                <CTableDataCell>
                  <CBadge color={
                    booth.status === 'available' ? 'success' :
                    booth.status === 'reserved' ? 'warning' :
                    booth.status === 'booked' ? 'secondary' :
                    booth.status === 'under_maintenance' ? 'danger' : 'secondary'
                  }>
                    {booth.status.charAt(0).toUpperCase() + booth.status.slice(1)}
                  </CBadge>
                </CTableDataCell>
                <CTableDataCell>
                  ${booth.price?.$numberDecimal || booth.price}
                </CTableDataCell>
                <CTableDataCell>
                  {booth.has_power && <CBadge color="info" className="me-1"><CIcon icon={cilBolt} /> Power</CBadge>}
                  {booth.has_wifi && <CBadge color="info" className="me-1"><CIcon icon={cilWifiSignal4} /> WiFi</CBadge>}
                  {booth.is_corner_booth && <CBadge color="warning" className="me-1"><CIcon icon={cilLocationPin} /> Corner</CBadge>}
                </CTableDataCell>
                <CTableDataCell>{booth.notes}</CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      )}
    </CCardBody>
  </CCard>
)

export default BoothsList