package com.placemark.explorer.places.controller;

import com.placemark.explorer.places.dto.group.CreateGroupRequest;
import com.placemark.explorer.places.dto.group.PlaceGroupResponse;
import com.placemark.explorer.places.mapper.PlaceMapper;
import com.placemark.explorer.places.service.PlaceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.transaction.Transactional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

@RestController
@RequestMapping("/api/v1/groups")
@Tag(name = "Groups")
@Validated
@Transactional(Transactional.TxType.SUPPORTS)
public class PlaceGroupController {

  private final PlaceService placeService;
  private final PlaceMapper mapper;

  public PlaceGroupController(PlaceService placeService, PlaceMapper mapper) {
    this.placeService = placeService;
    this.mapper = mapper;
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  @Operation(summary = "Create group")
  @Transactional
  public PlaceGroupResponse createGroup(@Valid @RequestBody CreateGroupRequest request) {
    return mapper.toResponse(placeService.createGroup(request));
  }

  @GetMapping("/{id}")
  @Operation(summary = "Get group by ID")
  public PlaceGroupResponse getGroup(@PathVariable("id") UUID id) {
    return mapper.toResponse(placeService.getGroup(id));
  }

  @GetMapping
  @Operation(summary = "List groups")
  public Page<PlaceGroupResponse> listGroups(
      @RequestParam(name = "page", defaultValue = "0") @Min(0) int page,
      @RequestParam(name = "size", defaultValue = "20") @Min(1) @Max(100) int size) {
    Pageable pageable = PageRequest.of(page, size);
    return placeService.listGroups(pageable).map(mapper::toResponse);
  }

  @PostMapping("/{groupId}/places/{placeId}")
  @Operation(summary = "Add place to group")
  @Transactional
  public PlaceGroupResponse addPlaceToGroup(@PathVariable("groupId") UUID groupId, @PathVariable("placeId") UUID placeId) {
    return mapper.toResponse(placeService.addPlaceToGroup(groupId, placeId));
  }

  @DeleteMapping("/{groupId}/places/{placeId}")
  @Operation(summary = "Remove place from group")
  @Transactional
  public PlaceGroupResponse removePlaceFromGroup(@PathVariable("groupId") UUID groupId, @PathVariable("placeId") UUID placeId) {
    return mapper.toResponse(placeService.removePlaceFromGroup(groupId, placeId));
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  @Operation(summary = "Soft delete group")
  @Transactional
  public void deleteGroup(@PathVariable("id") UUID id) {
    placeService.deleteGroup(id);
  }
}
