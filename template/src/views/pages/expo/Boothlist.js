import React, { useState, useMemo } from 'react'
import {
  CCard, CCardBody, CCardHeader, CTable, CTableHead, CTableRow, CTableHeaderCell,
  CTableBody, CTableDataCell, CBadge, CInputGroup, CFormInput, CButton, CCollapse
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilBolt, cilWifiSignal4, cilLocationPin, cilSearch, cilUser } from '@coreui/icons'

const BoothsList = ({ booths }) => {
  const [search, setSearch] = useState('')
  const [expandedBooth, setExpandedBooth] = useState(null)

  // Filter booths by booth number, floor, status, or exhibitor company name
  const filteredBooths = useMemo(() => {
    if (!search) return booths
    const s = search.toLowerCase()
    return booths.filter(booth =>
      booth.booth_number?.toLowerCase().includes(s) ||
      String(booth.floor).includes(s) ||
      booth.status?.toLowerCase().includes(s) ||
      booth.assigned_to?.company_name?.toLowerCase().includes(s)
    )
  }, [booths, search])

  return (
    <CCard className="mb-4 shadow-sm" style={{ borderRadius: '18px', overflow: 'hidden' }}>
      <CCardHeader className="bg-white" style={{ padding: '2rem 2rem 1rem 2rem', borderBottom: '1px solid #f1f5f9' }}>
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div>
            <h5 className="mb-0 text-primary fw-bold">Booths in this Expo</h5>
            <small className="text-body-secondary">
              All booths for: <strong>{booths[0]?.expo_id?.title || 'Expo'}</strong>
            </small>
          </div>
          <CInputGroup style={{ maxWidth: 320 }}>
            <CFormInput
              placeholder="Search booth, floor, status, exhibitor..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ borderRadius: '10px 0 0 10px' }}
            />
            <CButton type="button" color="primary" style={{ borderRadius: '0 10px 10px 0' }}>
              <CIcon icon={cilSearch} />
            </CButton>
          </CInputGroup>
        </div>
      </CCardHeader>
      <CCardBody style={{ padding: '2rem' }}>
        {filteredBooths.length === 0 ? (
          <div className="text-center text-muted py-4">No booths found for this expo.</div>
        ) : (
          <CTable hover responsive bordered align="middle" className="mb-0">
            <CTableHead>
              <CTableRow className="bg-light">
                <CTableHeaderCell>Booth #</CTableHeaderCell>
                <CTableHeaderCell>Floor</CTableHeaderCell>
                <CTableHeaderCell>Size</CTableHeaderCell>
                <CTableHeaderCell>Status</CTableHeaderCell>
                <CTableHeaderCell>Price</CTableHeaderCell>
                <CTableHeaderCell>Features</CTableHeaderCell>
                <CTableHeaderCell>Exhibitor</CTableHeaderCell>
                <CTableHeaderCell>Notes</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {filteredBooths.map(booth => (
                <React.Fragment key={booth._id}>
                  <CTableRow
                    style={{ cursor: booth.assigned_to ? 'pointer' : 'default' }}
                    onClick={() => booth.assigned_to && setExpandedBooth(expandedBooth === booth._id ? null : booth._id)}
                  >
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
                    <CTableDataCell>
                      {booth.assigned_to ? (
                        <span className="fw-bold text-success">
                          <CIcon icon={cilUser} className="me-1" />
                          {booth.assigned_to.company_name}
                        </span>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </CTableDataCell>
                    <CTableDataCell>{booth.notes}</CTableDataCell>
                  </CTableRow>
                  {/* Exhibitor details collapse */}
                  {booth.assigned_to && (
                    <CTableRow>
                      <CTableDataCell colSpan={8} style={{ padding: 0, background: '#f9fafb' }}>
                        <CCollapse visible={expandedBooth === booth._id}>
                          <div style={{
                            padding: '1.5rem 2rem',
                            borderRadius: '12px',
                            background: '#f3f4f6',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                            margin: '0.5rem 0'
                          }}>
                            <div className="row g-4 align-items-center">
                              <div className="col-md-4">
                                <div className="fw-bold mb-2 text-primary">Exhibitor Company</div>
                                <div>{booth.assigned_to.company_name}</div>
                              </div>
                              <div className="col-md-4">
                                <div className="fw-bold mb-2 text-primary">Product</div>
                                <div>{booth.assigned_to.product_description || '—'}</div>
                              </div>
                              <div className="col-md-4">
                                <div className="fw-bold mb-2 text-primary">Contact</div>
                                <div>
                                  <span className="me-2">
                                    <CIcon icon={cilUser} /> {booth.assigned_to.contact_info?.email}
                                  </span>
                                  <span>
                                    <CIcon icon={cilUser} /> {booth.assigned_to.contact_info?.phone}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CCollapse>
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </React.Fragment>
              ))}
            </CTableBody>
          </CTable>
        )}
      </CCardBody>
    </CCard>
  )
}

export default BoothsList