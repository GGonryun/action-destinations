import type { ActionDefinition } from '@segment/actions-core'
import type { Settings } from '../generated-types'
import { formatEmail, formatPhone, formatFirstName, formatLastName, formatStreet } from '../postConversion/formatter'
import type { Payload } from './generated-types'

const action: ActionDefinition<Settings, Payload> = {
  title: 'Upload Conversion Adjustment',
  description: 'Upload a conversion adjustment to the Google Ads API.',
  fields: {
    conversion_action: {
      label: 'Conversion Action ID',
      description:
        'The ID of the conversion action associated with this conversion. To find the Conversion Action ID, click on your conversion in Google Ads and get the value for ctId in the URL. For example, if the URL is https://ads.google.com/aw/conversions/detail?ocid=00000000&ctId=576882000, your Conversion Action ID is 576882000.',
      type: 'string',
      required: true,
      default: ''
    },
    adjustment_type: {
      label: 'Adjustment Type',
      description: 'The adjustment type. See Google’s documentation for details on each type.',
      type: 'string',
      choices: [
        { label: 'UNSPECIFIED', value: 'UNSPECIFIED' },
        { label: 'UNKNOWN', value: 'UNKNOWN' },
        { label: `RETRACTION`, value: 'RETRACTION' },
        { label: 'RESTATEMENT', value: 'RESTATEMENT' },
        { label: `ENHANCEMENT`, value: 'ENHANCEMENT' }
      ]
    },
    adjustment_timestamp: {
      label: 'Adjustment Timestamp',
      description:
        'The date time at which the adjustment occurred. Must be after the conversion_date_time. The timezone must be specified. The format is "yyyy-mm-dd hh:mm:ss+|-hh:mm", e.g. "2019-01-01 12:32:45-08:00".',
      type: 'string',
      required: true,
      default: {
        '@path': '$.timestamp'
      }
    },
    order_id: {
      label: 'Order ID',
      description:
        'The order ID of the conversion to be adjusted. If the conversion was reported with an order ID specified, that order ID must be used as the identifier here. Required for ENHANCEMENT adjustments.',
      type: 'string',
      default: {
        '@path': '$.properties.orderId'
      }
    },
    gclid: {
      label: 'GCLID',
      description:
        'Google click ID associated with the original conversion for this adjustment. This is used for the GCLID Date Time Pair. Required for non-ENHANCEMENT adjustments. If adjustment is ENHANCEMENT, this value is optional but may be set in addition to the order ID.',
      type: 'string',
      default: ''
    },
    conversion_timestamp: {
      label: 'Conversion Timestamp',
      description:
        'The date time at which the original conversion for this adjustment occurred. The timezone must be specified. The format is "yyyy-mm-dd hh:mm:ss+|-hh:mm", e.g. "2019-01-01 12:32:45-08:00". This is used for the GCLID Date Time Pair. Required for non-ENHANCEMENT adjustments. If adjustment is ENHANCEMENT, this value is optional but may be set in addition to the order ID.',
      type: 'string',
      required: true,
      default: {
        '@path': '$.timestamp'
      }
    },
    restatement_value: {
      label: 'Restatement Value',
      description:
        'The restated conversion value. This is the value of the conversion after restatement. For example, to change the value of a conversion from 100 to 70, an adjusted value of 70 should be reported. Required for RESTATEMENT adjustments.',
      type: 'number',
      default: ''
    },
    restatement_currency_code: {
      label: 'Restatement Currency Code',
      description:
        'The currency of the restated value. If not provided, then the default currency from the conversion action is used, and if that is not set then the account currency is used. This is the ISO 4217 3-character currency code e.g. USD or EUR.',
      type: 'string',
      default: ''
    },
    email_address: {
      label: 'Email Address',
      description:
        'Email address of the individual who triggered the conversion event. Segment will hash this value before sending to Google.',
      type: 'string',
      format: 'email',
      default: {
        '@if': {
          exists: { '@path': '$.properties.email' },
          then: { '@path': '$.properties.email' },
          else: { '@path': '$context.traits.email' }
        }
      }
    },
    phone_number: {
      label: 'Phone Number',
      description:
        'Phone number of the individual who triggered the conversion event, in E.164 standard format, e.g. +14150000000. Segment will hash this value before sending to Google.',
      type: 'string',
      default: {
        '@if': {
          exists: { '@path': '$.properties.phone' },
          then: { '@path': '$.properties.phone' },
          else: { '@path': '$context.traits.phone' }
        }
      }
    },
    first_name: {
      label: 'First Name',
      description:
        'First name of the user who performed the conversion. Segment will hash this value before sending to Google.',
      type: 'string',
      default: {
        '@if': {
          exists: { '@path': '$.properties.firstName' },
          then: { '@path': '$.properties.firstName' },
          else: { '@path': '$context.traits.firstName' }
        }
      }
    },
    last_name: {
      label: 'Last Name',
      description:
        'Last name of the user who performed the conversion. Segment will hash this value before sending to Google.',
      type: 'string',
      default: {
        '@if': {
          exists: { '@path': '$.properties.lastName' },
          then: { '@path': '$.properties.lastName' },
          else: { '@path': '$context.traits.lastName' }
        }
      }
    },
    city: {
      label: 'City',
      description: 'City of the user who performed the conversion.',
      type: 'string',
      default: {
        '@if': {
          exists: { '@path': '$.properties.address.city,' },
          then: { '@path': '$.properties.address.city,' },
          else: { '@path': '$.context.traits.address.city' }
        }
      }
    },
    state: {
      label: 'State',
      description: 'State of the user who performed the conversion.',
      type: 'string',
      default: {
        '@if': {
          exists: { '@path': '$.properties.address.state,' },
          then: { '@path': '$.properties.address.state,' },
          else: { '@path': '$.context.traits.address.state' }
        }
      }
    },
    country: {
      label: 'Country',
      description: '2-letter country code in ISO-3166-1 alpha-2 of the user who performed the conversion.',
      type: 'string',
      default: {
        '@if': {
          exists: { '@path': '$.properties.address.country,' },
          then: { '@path': '$.properties.address.country,' },
          else: { '@path': '$.context.traits.address.country' }
        }
      }
    },
    postal_code: {
      label: 'Postal Code',
      description: 'Postal code of the user who performed the conversion.',
      type: 'string',
      default: {
        '@if': {
          exists: { '@path': '$.properties.address.postalCode,' },
          then: { '@path': '$.properties.address.postalCode,' },
          else: { '@path': '$.context.traits.address.postalCode' }
        }
      }
    },
    street_address: {
      label: 'Street Address',
      description:
        'Street address of the user who performed the conversion. Segment will hash this value before sending to Google.',
      type: 'string',
      default: {
        '@if': {
          exists: { '@path': '$.properties.address.street,' },
          then: { '@path': '$.properties.address.street,' },
          else: { '@path': '$.context.traits.address.street' }
        }
      }
    },
    user_agent: {
      label: 'User Agent',
      description:
        'The user agent to enhance the original conversion. User agent can only be specified in enhancements with user identifiers. This should match the user agent of the request that sent the original conversion so the conversion and its enhancement are either both attributed as same-device or both attributed as cross-device.',
      type: 'string',
      default: {
        '@path': '$.context.userAgent'
      }
    }
  },
  perform: (request, { settings, payload }) => {
    const request_object: { [key: string]: any } = {
      conversionAction: `customers/${settings.customerId}/conversionActions/${payload.conversion_action}`,
      adjustmentType: payload.adjustment_type,
      adjustmentDateTime: payload.adjustment_timestamp, // TODO: format so timezone is specified
      orderId: payload.order_id,
      gclidDateTimePair: {
        gclid: payload.gclid,
        conversionDateTime: payload.conversion_timestamp // TODO: format so timezone is specified
      },
      restatementValue: {
        adjustedValue: payload.restatement_value,
        currencyCode: payload.restatement_currency_code
      },
      userAgent: payload.user_agent
    }

    if (payload.email_address) {
      const formattedEmail = formatEmail(payload.email_address)
      request_object.userIdentifiers = [
        {
          hashedEmail: formattedEmail
        }
      ]
    }

    if (payload.phone_number) {
      const formattedPhoneNumber = formatPhone(payload.phone_number)
      request_object.userIdentifiers = [
        {
          hashedPhoneNumber: formattedPhoneNumber
        }
      ]
    }

    if (
      payload.first_name ||
      payload.last_name ||
      payload.city ||
      payload.state ||
      payload.country ||
      payload.postal_code ||
      payload.street_address
    ) {
      request_object.userIdentifiers = [
        {
          addressInfo: {
            hashedFirstName: formatFirstName(payload.first_name),
            hashedLastName: formatLastName(payload.last_name),
            hashedStreetAddress: formatStreet(payload.street_address),
            city: payload.city,
            state: payload.state,
            countryCode: payload.country,
            postalCode: payload.postal_code
          }
        }
      ]
    }

    return request(
      `https://googleads.googleapis.com/v11/customers/${settings.customerId}:uploadConversionAdjustmentss`,
      {
        method: 'post',
        headers: {
          'developer-token': ''
        },
        json: {
          conversions: [request_object],
          partialFailure: true
        }
      }
    )
  }
}

export default action
