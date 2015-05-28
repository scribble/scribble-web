/*
 * Copyright 2015 Red Hat, Inc. and/or its affiliates
 * and other contributors as indicated by the @author tags.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.scribble.tools.web.rest;

import static javax.ws.rs.core.MediaType.APPLICATION_JSON;
import static javax.ws.rs.core.MediaType.APPLICATION_JSON_TYPE;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.container.AsyncResponse;
import javax.ws.rs.container.Suspended;
import javax.ws.rs.core.Response;

import org.scribble.tools.web.api.model.Protocol;
import org.scribble.tools.web.api.model.ProtocolProjection;
import org.scribble.tools.web.api.model.RoleInfo;
import org.scribble.tools.web.api.services.DefinitionManager;

import com.wordnik.swagger.annotations.Api;
import com.wordnik.swagger.annotations.ApiOperation;
import com.wordnik.swagger.annotations.ApiParam;
import com.wordnik.swagger.annotations.ApiResponse;
import com.wordnik.swagger.annotations.ApiResponses;

/**
 * REST interface for managing scribble protocols.
 *
 * @author gbrown
 *
 */
@Path("/protocols")
@Consumes(APPLICATION_JSON)
@Produces(APPLICATION_JSON)
@Api(value = "/", description = "Protocol management")
public class ProtocolsHandler {
    
    @Inject
    private DefinitionManager definitionManager;

    @PUT
    @Path("/{module}/{protocol}")
    @ApiOperation(value = "Create or update a protocol definition")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Create or update protocol succeeded."),
            @ApiResponse(code = 500, message = "Unexpected error happened while creating or updating the protocol") })
    public void createProtocol(
            @Suspended final AsyncResponse response,
            @ApiParam(required = true, value = "The module name") @PathParam("module") String moduleName,
            @ApiParam(required = true, value = "The protocol name") @PathParam("protocol") String protocolName,
            @ApiParam(value = "The protocol definition", required = true) Protocol definition) {

        try {
            definitionManager.updateProtocol(moduleName, protocolName, definition);

            response.resume(Response.status(Response.Status.OK).build());

        } catch (Throwable t) {
            Map<String, String> errors = new HashMap<String, String>();
            errors.put("errorMsg", "Internal Error: " + t.getMessage());
            response.resume(Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(errors).type(APPLICATION_JSON_TYPE).build());
        }
    }

    @GET
    @Path("/{module}/{protocol}")
    @Produces(APPLICATION_JSON)
    @ApiOperation(
            value = "Retrieve protocol definition for module and protocol name",
            response = Protocol.class)
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Success, protocol definition found and returned"),
            @ApiResponse(code = 500, message = "Internal server error"),
            @ApiResponse(code = 400, message = "Unknown module and/or protocol name") })
    public void getProtocol(@Suspended final AsyncResponse response,
            @ApiParam(required = true, value = "The module") @PathParam("module") String moduleName,
            @ApiParam(required = true, value = "The protocol name") @PathParam("protocol") String protocolName) {

        try {
            Protocol protocol = definitionManager.getProtocol(moduleName, protocolName);

            if (protocol == null) {
                response.resume(Response.status(Response.Status.BAD_REQUEST).type(APPLICATION_JSON_TYPE).build());
            } else {
                response.resume(Response.status(Response.Status.OK).entity(protocol).type(APPLICATION_JSON_TYPE)
                        .build());
            }
        } catch (Exception e) {
            Map<String, String> errors = new HashMap<String, String>();
            errors.put("errorMsg", "Internal Error: " + e.getMessage());
            response.resume(Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(errors).type(APPLICATION_JSON_TYPE).build());
        }

    }

    @GET
    @Path("/{module}/{protocol}/roles")
    @Produces(APPLICATION_JSON)
    @ApiOperation(
            value = "Retrieve protocol definition for module and protocol name",
            response = List.class)
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Success, protocol definition found and returned"),
            @ApiResponse(code = 500, message = "Internal server error"),
            @ApiResponse(code = 400, message = "Unknown module and/or protocol name") })
    public void getRoles(@Suspended final AsyncResponse response,
            @ApiParam(required = true, value = "The module") @PathParam("module") String moduleName,
            @ApiParam(required = true, value = "The protocol name") @PathParam("protocol") String protocolName) {

        try {
            Set<RoleInfo> roles = definitionManager.getRoles(moduleName, protocolName);

            if (roles == null) {
                response.resume(Response.status(Response.Status.BAD_REQUEST).type(APPLICATION_JSON_TYPE).build());
            } else {
                response.resume(Response.status(Response.Status.OK).entity(roles).type(APPLICATION_JSON_TYPE)
                        .build());
            }
        } catch (Exception e) {
            Map<String, String> errors = new HashMap<String, String>();
            errors.put("errorMsg", "Internal Error: " + e.getMessage());
            response.resume(Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(errors).type(APPLICATION_JSON_TYPE).build());
        }

    }

    @GET
    @Path("/")
    @Produces(APPLICATION_JSON)
    @ApiOperation(
            value = "Retrieve the list of modules",
            response = List.class)
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Success, modules found and returned"),
            @ApiResponse(code = 500, message = "Internal server error") })
    public void getModules(@Suspended final AsyncResponse response) {

        try {
            response.resume(Response.status(Response.Status.OK).entity(
                    definitionManager.getModules()).type(APPLICATION_JSON_TYPE)
                        .build());
        } catch (Exception e) {
            Map<String, String> errors = new HashMap<String, String>();
            errors.put("errorMsg", "Internal Error: " + e.getMessage());
            response.resume(Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(errors).type(APPLICATION_JSON_TYPE).build());
        }

    }

    @GET
    @Path("/{module}")
    @Produces(APPLICATION_JSON)
    @ApiOperation(
            value = "Retrieve protocol names within specified module",
            response = String.class)
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Success, module protocol names found and returned"),
            @ApiResponse(code = 500, message = "Internal server error"),
            @ApiResponse(code = 400, message = "Unknown module name") })
    public void getProtocols(@Suspended final AsyncResponse response,
            @ApiParam(required = true, value = "The module") @PathParam("module") String moduleName) {

        try {
            response.resume(Response.status(Response.Status.OK).entity(
                    definitionManager.getProtocols(moduleName)).type(APPLICATION_JSON_TYPE)
                        .build());
        } catch (Exception e) {
            Map<String, String> errors = new HashMap<String, String>();
            errors.put("errorMsg", "Internal Error: " + e.getMessage());
            response.resume(Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(errors).type(APPLICATION_JSON_TYPE).build());
        }

    }

}
