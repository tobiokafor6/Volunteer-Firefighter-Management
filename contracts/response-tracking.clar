;; Response Tracking Contract
;; Monitors participation in emergency calls

;; Define data variables
(define-data-var admin principal tx-sender)
(define-map emergency-calls
  { id: uint }
  {
    description: (string-utf8 500),
    location: (string-utf8 100),
    timestamp: uint,
    resolved: bool
  }
)

(define-map responses
  { call-id: uint, firefighter-id: uint }
  {
    response-time: uint,
    role: (string-utf8 50),
    hours-served: uint
  }
)

(define-data-var next-call-id uint u1)

;; Public functions
(define-public (create-emergency-call (description (string-utf8 500)) (location (string-utf8 100)))
  (let ((new-id (var-get next-call-id)))
    (if (is-eq tx-sender (var-get admin))
      (begin
        (map-set emergency-calls
          { id: new-id }
          {
            description: description,
            location: location,
            timestamp: block-height,
            resolved: false
          }
        )
        (var-set next-call-id (+ new-id u1))
        (ok new-id)
      )
      (err u403)
    )
  )
)

(define-public (record-response (call-id uint)
                               (firefighter-id uint)
                               (role (string-utf8 50))
                               (response-time uint))
  (if (is-eq tx-sender (var-get admin))
    (begin
      (map-set responses
        { call-id: call-id, firefighter-id: firefighter-id }
        {
          response-time: response-time,
          role: role,
          hours-served: u0
        }
      )
      (ok true)
    )
    (err u403)
  )
)

(define-public (update-hours-served (call-id uint)
                                   (firefighter-id uint)
                                   (hours-served uint))
  (let ((response (unwrap! (map-get? responses { call-id: call-id, firefighter-id: firefighter-id }) (err u404))))
    (if (is-eq tx-sender (var-get admin))
      (begin
        (map-set responses
          { call-id: call-id, firefighter-id: firefighter-id }
          (merge response { hours-served: hours-served })
        )
        (ok true)
      )
      (err u403)
    )
  )
)

(define-public (resolve-emergency-call (call-id uint))
  (let ((call (unwrap! (map-get? emergency-calls { id: call-id }) (err u404))))
    (if (is-eq tx-sender (var-get admin))
      (begin
        (map-set emergency-calls
          { id: call-id }
          (merge call { resolved: true })
        )
        (ok true)
      )
      (err u403)
    )
  )
)

;; Read-only functions
(define-read-only (get-emergency-call (id uint))
  (map-get? emergency-calls { id: id })
)

(define-read-only (get-response (call-id uint) (firefighter-id uint))
  (map-get? responses { call-id: call-id, firefighter-id: firefighter-id })
)
