;; Firefighter Registration Contract
;; Records training and certifications for volunteer firefighters

;; Define data variables
(define-data-var admin principal tx-sender)
(define-map firefighters
  { id: uint }
  {
    name: (string-utf8 100),
    address: principal,
    active: bool,
    join-date: uint
  }
)

(define-map certifications
  { firefighter-id: uint, cert-id: uint }
  {
    name: (string-utf8 100),
    issue-date: uint,
    expiry-date: uint,
    issuer: (string-utf8 100)
  }
)

(define-data-var next-firefighter-id uint u1)
(define-data-var next-certification-id uint u1)

;; Public functions
(define-public (register-firefighter (name (string-utf8 100)))
  (let ((new-id (var-get next-firefighter-id)))
    (if (is-eq tx-sender (var-get admin))
      (begin
        (map-set firefighters
          { id: new-id }
          {
            name: name,
            address: tx-sender,
            active: true,
            join-date: block-height
          }
        )
        (var-set next-firefighter-id (+ new-id u1))
        (ok new-id)
      )
      (err u403)
    )
  )
)

(define-public (add-certification (firefighter-id uint)
                                 (name (string-utf8 100))
                                 (issuer (string-utf8 100))
                                 (expiry-date uint))
  (let ((new-cert-id (var-get next-certification-id)))
    (if (is-eq tx-sender (var-get admin))
      (begin
        (map-set certifications
          { firefighter-id: firefighter-id, cert-id: new-cert-id }
          {
            name: name,
            issue-date: block-height,
            expiry-date: expiry-date,
            issuer: issuer
          }
        )
        (var-set next-certification-id (+ new-cert-id u1))
        (ok new-cert-id)
      )
      (err u403)
    )
  )
)

(define-public (set-firefighter-status (firefighter-id uint) (active bool))
  (let ((firefighter (unwrap! (map-get? firefighters { id: firefighter-id }) (err u404))))
    (if (is-eq tx-sender (var-get admin))
      (begin
        (map-set firefighters
          { id: firefighter-id }
          (merge firefighter { active: active })
        )
        (ok true)
      )
      (err u403)
    )
  )
)

;; Read-only functions
(define-read-only (get-firefighter (id uint))
  (map-get? firefighters { id: id })
)

(define-read-only (get-certification (firefighter-id uint) (cert-id uint))
  (map-get? certifications { firefighter-id: firefighter-id, cert-id: cert-id })
)
