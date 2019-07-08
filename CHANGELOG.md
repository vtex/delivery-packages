# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.17.1] - 2019-07-08

- Compare delivery dates with `shippingEstimateDate` instead of `shippingEstimate`.

## [2.17.0] - 2019-01-21

### Added

- Creates the parcel object using the `marketplaceItems` instead of the `items` if `marketplaceItems` has something in it and if the criteria `useMarketplaceItems` is true.
- Change the default options of `parcelify` adding `useMarketplaceItems` as `true`.

## [2.16.2] - 2018-12-12

## Fixed

- `addressType` is now case insensitive on address functions

## [2.16.1] - 2018-12-07

## [2.16.0] - 2018-12-07

## Fixed

- `getSlaType` for old checkIn

## Added

- CheckIn and utils functions (still without docs until we believe they should be public)

## [2.15.0] - 2018-11-27

## [2.14.1] - 2018-11-26

- Add CHANGELOG
- Add templates for issues and pull requests
- Update README
- Add `isGiftRegistry` function
